/**
 * Nominatim (OpenStreetMap) — free, no API key. Use at low volume.
 * Dev/preview use Vite proxy (/nominatim) to avoid browser CORS limits.
 * Override with VITE_NOMINATIM_BASE_URL for production reverse proxies.
 */
export const NOMINATIM_BASE_URL =
  import.meta.env.VITE_NOMINATIM_BASE_URL ??
  (import.meta.env.DEV ? '/nominatim' : 'https://nominatim.openstreetmap.org')

export const NOMINATIM_USER_AGENT =
  'ShambaIntel/1.0 (https://github.com/shamba-intel; weather dashboard)'
