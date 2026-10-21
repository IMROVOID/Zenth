import path from 'node:path';

/**
 * Central path helper. Filesystem I/O uses absolute paths anchored at the
 * working directory; anything reported to the user or persisted to disk as
 * configuration is converted to a working-directory-relative path.
 */

export function workingDir(): string {
  return process.cwd();
}

export function resolvePath(...segments: string[]): string {
  return path.resolve(workingDir(), ...segments);
}

/**
 * Converts a path into one safe to display. Targets inside the working
 * directory become working-directory-relative; targets on another drive or a
 * UNC share cannot be expressed relative to the working directory, so they are
 * made relative to their own root. The result is never absolute, but it may
 * not point back at the same file - use toRelativeConfigPath when the value
 * has to be read back later.
 */
export function toRelativePath(target: string): string {
  if (!target) return '.';

  const absolute = path.resolve(workingDir(), target);
  const relative = path.relative(workingDir(), absolute);
  if (relative && !path.isAbsolute(relative)) return relative;

  const rooted = path.relative(path.parse(absolute).root, absolute);
  return rooted || '.';
}

/**
 * Converts a path into one safe to persist in a configuration file. The result
 * must resolve back to the same file, so a target that has no working-directory
 * relative form (another drive, a UNC share) keeps its absolute path rather
 * than pointing somewhere else.
 */
export function toRelativeConfigPath(target: string): string {
  if (!target) return '.';

  const absolute = path.resolve(workingDir(), target);
  const relative = path.relative(workingDir(), absolute);
  if (relative && !path.isAbsolute(relative)) return relative.split(path.sep).join('/');

  return absolute.split(path.sep).join('/');
}
