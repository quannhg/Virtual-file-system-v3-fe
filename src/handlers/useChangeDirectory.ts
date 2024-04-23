import { usePwdStore } from '@states';

export const useChangeDirectory = (): ((directory: string) => void) => {
  const { updatePwdLocalStorage, readPwdLocalStorage } = usePwdStore();

  return (directory: string) => {
    let currentDirectory = readPwdLocalStorage();

    const parts = directory.split('/');

    for (const part of parts) {
      if (part === '..') {
        const splitPath = currentDirectory.split('/');
        if (splitPath.length > 1) {
          splitPath.pop();
          currentDirectory = splitPath.join('/') || '';
        }
      } else if (part === '--') {
        currentDirectory = '';
      } else {
        currentDirectory += '/' + part;
      }
    }

    updatePwdLocalStorage(currentDirectory);
  };
};
