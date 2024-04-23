import { readPwdLocalStorage, updatePwdLocalStorage } from '@utils';

export const changeDirectory = (directory: string): string => {
  let currentDirectory = readPwdLocalStorage();

  const parts = directory.split('/');

  for (const part of parts) {
    if (part === '..') {
      const splitPath = currentDirectory.split('/');
      if (splitPath.length > 1) {
        splitPath.pop();
        currentDirectory = splitPath.join('/') || '/';
      }
    } else if (part === '--') {
      currentDirectory = '';
    } else {
      currentDirectory += '/' + part;
    }
  }

  updatePwdLocalStorage(currentDirectory);

  return currentDirectory;
};
