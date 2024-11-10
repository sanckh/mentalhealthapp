/**
 * Converts a UTC timestamp to a local date string in the format YYYY-MM-DD.
 * @param {number} timestampSeconds - The UTC timestamp in seconds.
 * @returns {string} - The local date string in the format YYYY-MM-DD.
 */
export function convertToUserLocalTime(timestampSeconds: number): string {
    // Create a Date object using the UTC timestamp
    const utcDate = new Date(timestampSeconds * 1000);
  
    // Format the date directly to the user's local time zone in the YYYY-MM-DD format
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(utcDate.getDate()).padStart(2, '0');
  
    // Return the local date string in the format YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }
  