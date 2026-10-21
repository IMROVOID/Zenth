/** Asset path helpers for GitHub Pages deployment with basePath. */

import { BASE_PATH, withBasePath } from './sitePaths';

export function assetPath(path: string): string {
  return withBasePath(path);
}

export function imagePath(name: string): string {
  return withBasePath(`/images/${name}`);
}

export function videoPath(name: string): string {
  return withBasePath(`/videos/${name}`);
}

export { BASE_PATH };
