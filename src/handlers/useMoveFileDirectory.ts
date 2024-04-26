import { moveFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, cleanArgument, validatePath } from '@utils';

export const useMoveFileDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    try {
      const { oldPath, destinationPath } = parseArguments(argumentString);

      const absoluteOldPath = inferPath(currentDirectory, oldPath);
      const absoluteDestinationPath = inferPath(currentDirectory, destinationPath);

      await moveFileDirectory(absoluteOldPath, absoluteDestinationPath);
    } catch (err) {
      throw err;
    }
  };
};

const parseArguments = (argumentString: string) => {
  const args = argumentString.trim().match(/"([^"]+)"|\S+/g) || [];

  if (args.length < 2) {
    throw Error(`Missing argument, required 'old path' and 'destination path'`);
  }

  if (args.length > 3) {
    throw Error(`Unrecognized argument(s): ${args.slice(3).join(', ')}`);
  }

  const oldPath = cleanArgument(args[0] || '');
  validatePath(oldPath);

  const destinationPath = cleanArgument(args[1] || '');
  validatePath(destinationPath);

  return { oldPath, destinationPath };
};
