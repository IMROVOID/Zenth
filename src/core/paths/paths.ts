import path from 'node:path';

/**
 * Central path helper. Filesystem I/O uses absolute paths anchored at the
 * working directory; anything reported to the user or persisted to disk as
 * configuration is converted to a working-directory-relative path.
 */

const DRIVE_ROOTED = /^[A-Za-z]:[\\/]/;
const UNC_ROOTED = /^\\\\[^\\]/;
const ANY_ROOT = /^(?:[A-Za-z]:[\\/]|[\\/]+)/;

export function workingDir(): string {
  return process.cwd();
}

export function resolvePath(...segments: string[]): string {
  return path.resolve(workingDir(), ...segments);
}

/**
 * Absolute under either the POSIX or the Windows convention. A Windows path on a
 * POSIX host (and the reverse) is absolute somewhere while the local path module
 * reports it as relative, so both conventions have to be consulted.
 */
function isAbsoluteAnywhere(value: string): boolean {
  return path.isAbsolute(value) || path.win32.isAbsolute(value);
}

/** Strips whichever root a target can carry, so the result is never absolute. */
function stripRoot(value: string): string {
  return value.replace(/^\\\\\?\\/, '').replace(ANY_ROOT, '');
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

  // A drive-letter or UNC target on a host whose path module does not treat it
  // as absolute has no working-directory-relative form here, so it is reported
  // from its own root instead of being passed through untouched.
  if (!path.isAbsolute(target) && (DRIVE_ROOTED.test(target) || UNC_ROOTED.test(target))) {
    return stripRoot(target) || '.';
  }

  const absolute = path.resolve(workingDir(), target);
  const relative = path.relative(workingDir(), absolute);
  if (relative && !isAbsoluteAnywhere(relative)) return relative;

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
