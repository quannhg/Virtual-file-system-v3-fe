import { usePwdStore } from '@states';

export const useChangeDirectory = (): ((directory: string) => Promise<void | string>) => {
  const { updatePwd, currentDirectory } = usePwdStore();

  return async (directory: string) => {
    let updatedDirectory = currentDirectory;

    const parts = directory.split('/');

    for (const part of parts) {
      if (part === '..') {
        const splitPath = updatedDirectory.split('/');
        if (splitPath.length > 1) {
          splitPath.pop();
          updatedDirectory = splitPath.join('/') || '';
        }
      } else if (part === '--') {
        updatedDirectory = '';
      } else {
        updatedDirectory += '/' + part;
      }
    }

    const errorMessage = await updatePwd(updatedDirectory);

    if (errorMessage) {
      return errorMessage;
    } else {
      return;
    }
  };
};
