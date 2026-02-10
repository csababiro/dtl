/**
 * Returns a Google Maps URL that opens the location (search). User can then
 * tap "Directions" for navigation.
 */
export function getMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
