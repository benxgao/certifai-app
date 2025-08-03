/**
 * Utility functions for handling URL slugs
 */

/**
 * Create a URL-friendly slug from a certification name
 * @param name The certification name to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[\s\W-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length and remove any trailing hyphens
      .substring(0, 100)
      .replace(/-+$/, '')
  );
}

/**
 * Normalize a slug to ensure consistent format
 * @param slug The slug to normalize
 * @returns A normalized slug
 */
export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate if a string is a valid slug format
 * @param slug The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
}
