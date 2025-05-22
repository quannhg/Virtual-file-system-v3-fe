import { grepFile } from '@services';
import { usePwdStore } from '@states';
import { extractArguments, inferPath, normalizePath, removeQuotes } from '@utils';

export const useGrepFile = (): ((
  argumentString: string
) => Promise<{ matchingResults: { path: string; content: string }[] }>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const args = extractArguments(argumentString);

    if (!args?.length) {
      throw new Error(
        'Invalid arguments\nUsage: grep CONTENT [FOLDER_PATH] [--recursive|--no-recursive]'
      );
    }

    const contentSearch = removeQuotes(args.shift()!);
    let folderPath = currentDirectory;
    let recursive = true;

    if (args.length > 0 && !args[0].startsWith('--')) {
      folderPath = normalizePath(args.shift()!) || '/';
    }

    // Nhận flag --recursive hoặc --no-recursive
    if (args.length > 0) {
      const flag = args.shift()!;
      if (flag === '--recursive') {
        recursive = true;
      } else if (flag === '--no-recursive') {
        recursive = false;
      } else {
        throw new Error('Invalid flag. Use --recursive or --no-recursive');
      }
    }

    if (args.length > 0) {
      throw new Error(
        'Too many arguments\nUsage: grep CONTENT [FOLDER_PATH] [--recursive|--no-recursive]'
      );
    }

    const fullPath = inferPath(currentDirectory, folderPath);
    const results = await grepFile(contentSearch, fullPath, recursive);

    return {
      matchingResults: results,
      contentSearch
    };
  };
};
