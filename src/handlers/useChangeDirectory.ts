import { usePwdStore } from '@states';
import { inferPath, normalizePath, extractArguments } from '@utils';

export const useChangeDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { updatePwd, currentDirectory } = usePwdStore();

  return async (argumentsString: string) => {
    const args = extractArguments(argumentsString);

    if (!args?.length) {
      throw Error('Invalid arguments\nUsage: cd FOLDER_PATH');
    }

    const folderPath = normalizePath(args.shift()!);

    if (args.length > 0) {
      throw Error('Invalid arguments\nUsage: cd FOLDER_PATH');
    }

    const updatedDirectory = inferPath(currentDirectory, folderPath);

    await updatePwd(updatedDirectory);
  };
};
