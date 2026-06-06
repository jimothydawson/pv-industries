const QUOTE_FORM_NAMES = new Set([
  'collection-quote-request',
  'bankstown-dropoff-request',
  'custom-quote-request'
]);

function field(formData, name) {
  return String(formData.get(name) || '').trim();
}

function block(message, status = 422) {
  return new Response(message, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}

function getEnv(name) {
  if (typeof Netlify !== 'undefined' && Netlify.env && typeof Netlify.env.get === 'function') {
    return Netlify.env.get(name) || '';
  }
  if (typeof Deno !== 'undefined' && Deno.env && typeof Deno.env.get === 'function') {
    return Deno.env.get(name) || '';
  }
  return '';
}

function formDataToPayload(formData) {
  const payload = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') payload[key] = value;
  }
  if (!payload.quoteRequestId) {
    payload.quoteRequestId = crypto.randomUUID();
  }
  return payload;
}

async function forwardQuoteToCrm(formData) {
  const ingestUrl = getEnv('CRM_QUOTE_INGEST_URL');
  const ingestSecret = getEnv('CRM_INGEST_SECRET');

  if (!ingestUrl || !ingestSecret) return;

  try {
    const response = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${ingestSecret}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(formDataToPayload(formData))
    });
    if (!response.ok) {
      console.error('CRM quote forwarding returned status', response.status);
    }
  } catch (error) {
    console.error('CRM quote forwarding failed', error);
  }
}

function countLetters(value) {
  const matches = value.match(/\p{L}/gu);
  return matches ? matches.length : 0;
}

function looksLikePersonName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  if (countLetters(trimmed) < 2) return false;
  if (/https?:|www\.|@/i.test(trimmed)) return false;
  if (/^\d+$/.test(trimmed.replace(/\s+/g, ''))) return false;
  return true;
}

function getEmailParts(email) {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return null;
  return { local: parts[0], domain: parts[1] };
}

function looksLikeDisposableOrSpamEmail(email) {
  const parts = getEmailParts(email);
  if (!parts) return true;

  const numericMailbox = /^\d{7,}$/.test(parts.local);
  const highRiskDomain = /^(qq\.com|163\.com|126\.com|mail\.ru|yandex\.ru)$/.test(parts.domain);

  return parts.domain === 'qq.com' || (numericMailbox && highRiskDomain);
}

function normalizeAustralianPhone(phone) {
  let compact = phone.replace(/[^\d+]/g, '');

  if (compact.indexOf('+') > 0) return '';
  if (compact.indexOf('+') === 0) {
    if (compact.indexOf('+61') !== 0) return '';
    compact = '0' + compact.slice(3);
  } else if (compact.indexOf('0061') === 0) {
    compact = '0' + compact.slice(4);
  } else if (compact.indexOf('61') === 0 && compact.length === 11) {
    compact = '0' + compact.slice(2);
  }

  return compact;
}

function looksLikeAustralianPhone(phone) {
  const normalized = normalizeAustralianPhone(phone);

  return /^04\d{8}$/.test(normalized) ||
    /^0[2378]\d{8}$/.test(normalized) ||
    /^13\d{4}$/.test(normalized) ||
    /^1300\d{6}$/.test(normalized) ||
    /^1800\d{6}$/.test(normalized);
}

function containsNonAustralianLocation(value) {
  return /\b(usa|u\.s\.a\.|united states|new york|nyc|ny)\b/i.test(value);
}

function getDateOnly(value) {
  const parts = value.split('-').map((part) => parseInt(part, 10));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function isValidDropOffDate(value) {
  const selected = getDateOnly(value);
  if (!selected) return false;

  const earliest = new Date();
  earliest.setHours(0, 0, 0, 0);

  const latest = new Date();
  latest.setHours(0, 0, 0, 0);
  latest.setMonth(latest.getMonth() + 6);

  return selected >= earliest && selected <= latest;
}

function validateQuoteSubmission(formData) {
  if (field(formData, 'bot-field') || field(formData, 'website')) {
    return { ok: false, silent: true };
  }

  if (!looksLikePersonName(field(formData, 'customerName'))) {
    return { ok: false, message: 'Invalid customer name.' };
  }

  if (looksLikeDisposableOrSpamEmail(field(formData, 'email'))) {
    return { ok: false, message: 'Invalid email address.' };
  }

  if (!looksLikeAustralianPhone(field(formData, 'contactNumber'))) {
    return { ok: false, message: 'Invalid phone number.' };
  }

  const locationText = [
    field(formData, 'collectionAddress'),
    field(formData, 'projectDetails'),
    field(formData, 'businessName')
  ].join(' ');

  if (containsNonAustralianLocation(locationText)) {
    return { ok: false, message: 'Invalid project location.' };
  }

  const formName = field(formData, 'form-name');
  if (formName === 'bankstown-dropoff-request' && !isValidDropOffDate(field(formData, 'preferredDropOffDate'))) {
    return { ok: false, message: 'Invalid drop-off date.' };
  }

  if (formName === 'custom-quote-request') {
    if (!field(formData, 'collectionAddress')) return { ok: false, message: 'Missing project location.' };
    if (!field(formData, 'panelCount')) return { ok: false, message: 'Missing panel count.' };
    if (field(formData, 'projectDetails').length < 20) return { ok: false, message: 'Missing project details.' };
  }

  return { ok: true };
}

export default async function filterQuoteSpam(request, context) {
  if (request.method !== 'POST') return context.next();

  const contentType = request.headers.get('content-type') || '';
  if (!/application\/x-www-form-urlencoded|multipart\/form-data/i.test(contentType)) {
    return context.next();
  }

  let formData;
  try {
    formData = await request.clone().formData();
  } catch {
    return context.next();
  }

  if (!QUOTE_FORM_NAMES.has(field(formData, 'form-name'))) {
    return context.next();
  }

  const validation = validateQuoteSubmission(formData);
  if (!validation.ok) {
    return validation.silent
      ? block('Thanks, your request has been received.', 200)
      : block(validation.message);
  }

  await forwardQuoteToCrm(formData);

  return context.next();
}
