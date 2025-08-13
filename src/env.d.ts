/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Extend the Window interface for Brevo form properties
declare global {
  interface Window {
    REQUIRED_CODE_ERROR_MESSAGE?: string;
    LOCALE?: string;
    EMAIL_INVALID_MESSAGE?: string;
    SMS_INVALID_MESSAGE?: string;
    REQUIRED_ERROR_MESSAGE?: string;
    GENERIC_INVALID_MESSAGE?: string;
    REQUIRED_MULTISELECT_MESSAGE?: string;
    translation?: {
      common: {
        selectedList: string;
        selectedLists: string;
        selectedOption: string;
        selectedOptions: string;
      };
    };
  }
}

export {};