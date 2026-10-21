/**
 * Single source of truth for the deployed site origin and base path.
 *
 * The custom domain (zenth.rovoid.tech) serves the site at the root, so the
 * base path is empty by default. Set NEXT_PUBLIC_BASE_PATH to serve the site
 * from a subpath instead (e.g. /Zenth for the GitHub Pages project URL).
 */

const DEFAULT_SITE_ORIGIN = 'https://zenth.rovoid.tech';

/**
 * Normalizes a base path to either '' or '/segment'. A protocol-relative or
 * otherwise non-local value is rejected so it can never turn an asset URL
 * into an off-site reference.
 */
export function normalizeBasePath(raw: string | undefined): string {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed === '/') return '';
  if (!/^\/[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(trimmed)) {
    throw new Error(`Invalid NEXT_PUBLIC_BASE_PATH: ${trimmed}`);
  }
  return trimmed;
}

export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN).replace(/\/+$/, '');
export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export function withBasePath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}
