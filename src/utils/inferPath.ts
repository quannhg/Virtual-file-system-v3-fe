export const inferPath = (currentPath: string, appendedPath: string): string => {
  if (appendedPath.length === 0) return currentPath.length !== 0 ? currentPath : '/';

  if (appendedPath === '/') {
    return '/';
  }

  if (appendedPath[0] === '/') {
    currentPath = '';
  }

  const parts = appendedPath.replace(/^\//g, '').split('/');

  let hasSlashAtTail = false;
  if (parts[parts.length - 1] === '') {
    parts.pop();
    hasSlashAtTail = true;
  }

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

  return (resultPath.length !== 0 ? resultPath : '/') + (hasSlashAtTail ? '/' : '');
};
