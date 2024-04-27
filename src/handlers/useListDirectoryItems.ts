import { listDirectoryItems } from '@services';
import { usePwdStore } from '@states';
import { inferPath } from '@utils';

export const useListDirectoryItems = (): ((
  directory: string | undefined
) => Promise<ListDirectoryItem[]>) => {
  const { currentDirectory } = usePwdStore();

  return async (directory: string | undefined) => {
    const targetDirectory = inferPath(currentDirectory, directory || '');

    console.debug(targetDirectory);

    try {
      return await listDirectoryItems(targetDirectory);
    } catch (err) {
      throw err;
    }
  };
};
