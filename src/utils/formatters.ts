
/**
 * Format a US phone number string
 * @param phoneString Raw phone number digits
 * @returns Formatted phone number as (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phoneString: string): string => {
  if (!phoneString) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneString.replace(/\D/g, '');
  
  // If the string is empty after cleaning, return empty string
  if (!cleaned) return '';
  
  // Format as US phone number
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    // Drop the country code if present
    const areaCode = match[2];
    const middle = match[3];
    const last = match[4];
    
    return `(${areaCode}) ${middle}-${last}`;
  }
  
  // For partial numbers, try to format what we have
  if (cleaned.length > 6) {
    const areaCode = cleaned.substring(0, 3);
    const middle = cleaned.substring(3, 6);
    const last = cleaned.substring(6, 10);
    
    if (last.length > 0) {
      return `(${areaCode}) ${middle}-${last}`;
    } else {
      return `(${areaCode}) ${middle}`;
    }
  } else if (cleaned.length > 3) {
    const areaCode = cleaned.substring(0, 3);
    const middle = cleaned.substring(3);
    return `(${areaCode}) ${middle}`;
  } else if (cleaned.length > 0) {
    return `(${cleaned}`;
  }
  
  // If the input doesn't match our expected format
  // Just return what we have (might be partial number)
  return cleaned;
};
