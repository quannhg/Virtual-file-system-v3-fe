import { updateFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, cleanArgument, validatePath } from '@utils';

export const useUpdateFileOrDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    try {
      const { oldPath, newPath, newData } = parseArguments(argumentString);

      const absoluteOldPath = inferPath(currentDirectory, oldPath);
      const absoluteNewPath = inferPath(currentDirectory, newPath);

      await updateFileDirectory(absoluteOldPath, absoluteNewPath, newData);
    } catch (err) {
      throw err;
    }
  };
};

const parseArguments = (argumentString: string) => {
  const args = argumentString.match(/"([^"]+)"|\S+/g) || [];

  if (args.length < 2) {
    throw Error(`Missing argument, required 'old path' and 'new path'`);
  }

  if (args.length > 3) {
    throw Error(`Unrecognized argument(s): ${args.slice(3).join(', ')}`);
  }

  const oldPath = cleanArgument(args[0] || '');
  validatePath(oldPath);

  const newPath = cleanArgument(args[1] || '');
  validatePath(newPath);

  const newData = args.length === 3 ? cleanArgument(args[2] || '') : null;

  return { oldPath, newPath, newData };
};
