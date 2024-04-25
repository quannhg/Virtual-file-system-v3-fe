import { PATH_IS_REQUIRED } from '@constants';
import { usePwdStore } from '@states';
import { appendPath } from '@utils';
import { showFileContent } from '@services';

export const useShowFileContent = (): ((filePath: string) => Promise<string>) => {
  const { currentDirectory } = usePwdStore();

  return async (filePath: string) => {
    if (!filePath) throw Error(PATH_IS_REQUIRED);

    const absoluteFilePath = appendPath(currentDirectory, filePath);
    try {
      const fileData = await showFileContent(absoluteFilePath);
      return fileData;
    } catch (err) {
      throw err;
    }
  };
};
