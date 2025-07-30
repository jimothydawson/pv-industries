/**
 * Utility functions for managing section numbering
 */

/**
 * Formats a section number with leading zero if needed
 * @param num - The section number
 * @returns Formatted section number (e.g., "01", "02", "10")
 */
export function formatSectionNumber(num: number | string): string {
  return num.toString().padStart(2, '0');
}

/**
 * Calculates section number based on position in an array of sections
 * @param sections - Array of section names or components
 * @param currentSection - The current section name to find
 * @param startFrom - Starting number (default: 1)
 * @returns Formatted section number
 */
export function calculateSectionNumber(
  sections: string[], 
  currentSection: string, 
  startFrom: number = 1
): string {
  const index = sections.indexOf(currentSection);
  if (index === -1) {
    console.warn(`Section "${currentSection}" not found in sections array`);
    return formatSectionNumber(startFrom);
  }
  return formatSectionNumber(index + startFrom);
}

/**
 * Auto-generates section numbers for a page based on section order
 * @param sectionNames - Array of section names in order
 * @param startFrom - Starting number (default: 1)
 * @returns Object mapping section names to formatted numbers
 */
export function generateSectionNumbers(
  sectionNames: string[], 
  startFrom: number = 1
): Record<string, string> {
  const sectionNumbers: Record<string, string> = {};
  
  sectionNames.forEach((sectionName, index) => {
    sectionNumbers[sectionName] = formatSectionNumber(index + startFrom);
  });
  
  return sectionNumbers;
}