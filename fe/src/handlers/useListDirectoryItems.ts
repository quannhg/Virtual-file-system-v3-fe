import { listDirectoryItems } from '@services';
import { usePwdStore } from '@states';
import { inferPath, extractArguments, normalizePath } from '@utils';

export const useListDirectoryItems = (): ((
  directory: string | undefined
) => Promise<ListDirectoryItem[]>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentsString: string | undefined) => {
    const args = extractArguments(argumentsString || '');

    if (!args) {
      throw Error('Invalid arguments\nUsage: ls [FOLDER_PATH]');
    }

    const folderPath = normalizePath(args.shift() || '');

    if (args.length > 0) {
      throw Error('Invalid arguments\nUsage: ls [FOLDER_PATH]');
    }

    const targetDirectory = inferPath(currentDirectory, folderPath);

    return await listDirectoryItems(targetDirectory);
  };
};
