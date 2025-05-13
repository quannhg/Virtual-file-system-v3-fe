import { grepFile } from '@services';
import { usePwdStore } from '@states';
import { extractArguments, inferPath, normalizePath, removeQuotes } from '@utils';

type FindResult = {
  keyString: string;
  matchingPaths: string[];
};

export const useGrepFile = (): ((
  argumentString: string
) => Promise<{ keyString: string; matchingPaths: string[] }>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const { keyString, findPath } = parseArguments(argumentString);

    const targetDirectory = inferPath(currentDirectory, findPath || '');

    const matchingPaths = await grepFile(keyString, targetDirectory);

    if (!Array.isArray(matchingPaths)) {
      throw new Error('Invalid response from server: expected an array');
    }

    return {
      keyString,
      matchingPaths
    };
  };
};

const usage = 'Usage: grep CONTENT [FOLDER_PATH]';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) {
    throw new Error(invalidDiagnostic);
  }

  const keyString = removeQuotes(args.shift()!);
  const findPath = normalizePath(args.shift() || '') || null;

  if (args.length > 0) {
    throw new Error(invalidDiagnostic);
  }

  return { keyString, findPath };
};
