/** Asset path helpers for GitHub Pages deployment with basePath. */

const isProd = process.env.NODE_ENV === 'production';
const BASE_PATH = isProd ? '/Zenth' : '';

export function assetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}

export function imagePath(name: string): string {
  return assetPath(`/images/${name}`);
}

export function videoPath(name: string): string {
  return assetPath(`/videos/${name}`);
}