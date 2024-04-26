import { PATH_IS_REQUIRED } from '@constants';
import { usePwdStore } from '@states';
import { inferPath, normalizePath } from '@utils';

export const useChangeDirectory = (): ((directory: string) => Promise<void>) => {
  const { updatePwd, currentDirectory } = usePwdStore();

  return async (directory: string) => {
    if (!directory) throw Error(PATH_IS_REQUIRED);

    const updatedDirectory = normalizePath(inferPath(currentDirectory, directory));

    try {
      await updatePwd(updatedDirectory);
    } catch (err) {
      throw err;
    }
  };
};
