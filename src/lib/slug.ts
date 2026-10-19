export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'login',
  'register',
  'reset-password',
  'dashboard',
  'events',
  'catalog',
  'pricing',
  'faq',
  'contact',
  'terms',
  'privacy',
  'legal',
  'settings',
  'checkout',
  'orders',
  'profile',
  'not-found',
  '_next',
  'static',
  'favicon.ico',
])

/**
 * Normalizes any text into a valid URL-safe slug.
 */
export function normalizeSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
    .replace(/[\s_]+/g, '-') // replace spaces and underscores with hyphen
    .replace(/-+/g, '-') // replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}

/**
 * Checks if a slug is reserved for system routes.
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase())
}
