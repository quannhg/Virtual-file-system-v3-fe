import { createFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { appendPath, cleanArgument, validatePath } from '@utils';

export const useCreateFileOrDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    try {
      const { path, data, createParents } = parseArguments(argumentString);

      if (!createParents && path && path.includes('/')) {
        throw new Error(`Cannot create parent directory! Add '-p' to create parent directory.`);
      }

      const newPath = appendPath(currentDirectory, path);

      await createFileDirectory(newPath, data);
    } catch (err) {
      throw err;
    }
  };
};

const parseArguments = (argumentString: string) => {
  const args = argumentString.trim().match(/"([^"]+)"|\S+/g) || [];

  if (args.length === 0) {
    throw Error(`Missing 'path' argument`);
  }

  const createParents = args[0] === '-p';

  const pathIndex = createParents ? 1 : 0;
  const path = cleanArgument(args[pathIndex] || '');
  validatePath(path);

  const minimumLen = createParents ? 2 : 1;

  if (args.length < minimumLen) {
    throw Error(`Missing 'path' argument`);
  }

  if (args.length > minimumLen + 1) {
    throw Error(`Unrecognized argument(s): ${args.slice(minimumLen + 1).join(', ')}`);
  }

  let data = null;
  if (args.length === minimumLen + 1) {
    data = cleanArgument(args[minimumLen] || '');
  }

  return { path, data, createParents };
};
