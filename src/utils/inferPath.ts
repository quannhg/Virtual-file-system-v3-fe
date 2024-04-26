export const inferPath = (currentPath: string, appendedPath: string): string => {
  if (appendedPath === '/' || appendedPath.length === 0) return currentPath;

  if (appendedPath[0] === '/') {
    currentPath = '';
  }

  const parts = appendedPath.replace(/^\/+|\/+$/g, '').split('/');
  let resultPath = currentPath;

  for (const part of parts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      const splitPath = resultPath.split('/');
      if (splitPath.length > 1) {
        splitPath.pop();
        resultPath = splitPath.join('/') || '';
      }
    } else if (part === '--') {
      resultPath = '';
    } else {
      resultPath += '/' + part;
    }
  }

  return resultPath;
};
