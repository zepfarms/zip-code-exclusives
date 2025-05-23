
/**
 * Format a US phone number string
 * @param phoneString Raw phone number digits
 * @returns Formatted phone number as (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phoneString: string): string => {
  if (!phoneString) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneString.replace(/\D/g, '');
  
  // Format as US phone number
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    // Drop the country code if present
    const areaCode = match[2];
    const middle = match[3];
    const last = match[4];
    
    return `(${areaCode}) ${middle}-${last}`;
  }
  
  // If the input doesn't match our expected format
  // Just return the cleaned string (digits only)
  return cleaned;
};
