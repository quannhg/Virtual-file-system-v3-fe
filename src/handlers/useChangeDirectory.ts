import { usePwdStore } from '@states';
import { appendPath } from '@utils';

export const useChangeDirectory = (): ((directory: string) => Promise<void>) => {
  const { updatePwd, currentDirectory } = usePwdStore();

  return async (directory: string) => {
    const updatedDirectory = appendPath(currentDirectory, directory);

    try {
      await updatePwd(updatedDirectory);
    } catch (err) {
      throw err;
    }
  };
};
