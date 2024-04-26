export function validatePath(path: string) {
  const isValidPath = /^[a-zA-Z0-9 _-]+$/.test(path);
  if (!isValidPath) {
    throw new Error(
      `Invalid characters in path: ${path}. Path can only contain alphanumeric characters, spaces, underscores, hyphens, and slashes.`
    );
  }
  if (path.includes('//')) {
    throw Error(`Invalid path: ${path}. Consecutive slash characters are not allowed.`);
  }
}
