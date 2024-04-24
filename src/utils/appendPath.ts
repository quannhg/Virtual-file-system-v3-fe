export const appendPath = (oldPath: string, appendedPath: string): string => {
  const parts = appendedPath.replace(/^\/+|\/+$/g, '').split('/');
  let resultPath = oldPath;

  for (const part of parts) {
    if (part === '..') {
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

  console.log(resultPath);
  return resultPath;
};
