// useGrepFile.ts
import { grepFile } from '@services';
import { usePwdStore } from '@states';
import { extractArguments, inferPath, normalizePath, removeQuotes } from '@utils';

export const useGrepFile = (): ((
  argumentString: string
) => Promise<{ matchingResults: { path: string; content: string }[] }>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const args = extractArguments(argumentString);

    if (!args?.length) throw new Error('Invalid arguments\nUsage: grep CONTENT [FOLDER_PATH]');

    const contentSearch = removeQuotes(args.shift()!);
    const folderPath = normalizePath(args.shift() || '') || '/';

    if (args.length > 0) throw new Error('Invalid arguments\nUsage: grep CONTENT [FOLDER_PATH]');

    const fullPath = inferPath(currentDirectory, folderPath);
    const results = await grepFile(contentSearch, fullPath);

    return { matchingResults: results };
  };
};
