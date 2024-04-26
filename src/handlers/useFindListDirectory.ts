import { findFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { cleanArgument, inferPath, validatePath } from '@utils';

export const useFindFileDirectory = (): ((
  argumentString: string
) => Promise<{ keyString: string; matchingPaths: string[] }>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const { keyString, findPath } = parseArguments(argumentString);

    const targetDirectory = inferPath(currentDirectory, findPath || '');
    try {
      const matchingPaths = await findFileDirectory(keyString, targetDirectory);
      return {
        keyString,
        matchingPaths
      };
    } catch (err) {
      throw err;
    }
  };
};

const parseArguments = (argumentString: string) => {
  const args = argumentString.trim().match(/"([^"]+)"|\S+/g) || [];

  if (args.length < 1) {
    throw Error(`Missing argument, required 'key string'`);
  }

  if (args.length > 3) {
    throw Error(`Unrecognized argument(s): ${args.slice(3).join(', ')}`);
  }

  const keyString = cleanArgument(args[0] || '');
  const isKeyString = /^[a-zA-Z0-9 _-]+$/.test(keyString);
  if (!isKeyString) {
    throw new Error(
      `Invalid characters in key string: ${args[0]}. Key string can only contain alphanumeric characters, spaces, underscores, and hyphens.`
    );
  }

  let findPath = undefined;
  if (args.length === 2) {
    const path = cleanArgument(args[1] || '');
    validatePath(path);
    findPath = path;
  }

  return { keyString, findPath };
};
