import { listDirectoryItems } from '@services';
import { usePwdStore } from '@states';
import { appendPath } from '@utils';

export const useListDirectoryItems = (): ((
  directory: string | undefined
) => Promise<ListDirectoryItem[]>) => {
  const { currentDirectory } = usePwdStore();

  return async (directory: string | undefined) => {
    const targetDirectory = appendPath(currentDirectory, directory || '');

    try {
      return await listDirectoryItems(targetDirectory);
    } catch (err) {
      throw err;
    }
  };
};
