import { findFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { extractArguments, inferPath, normalizePath, removeQuotes } from '@utils';

export const useFindFileDirectory = (): ((
  argumentString: string
) => Promise<{ keyString: string; matchingPaths: string[] }>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const { keyString, findPath } = parseArguments(argumentString);

    const targetDirectory = inferPath(currentDirectory, findPath || '');

    const matchingPaths = await findFileDirectory(keyString, targetDirectory);

    return {
      keyString,
      matchingPaths
    };
  };
};

const usage = 'Usage: find NAME [FOLDER_PATH]';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) {
    throw Error(invalidDiagnostic);
  }

  const keyString = removeQuotes(args.shift()!);

  const findPath = normalizePath(args.shift() || '') || null;

  if (args.length > 0) {
    throw Error(invalidDiagnostic);
  }

  return { keyString, findPath };
};
