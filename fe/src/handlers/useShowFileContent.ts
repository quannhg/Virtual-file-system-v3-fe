import { usePwdStore } from '@states';
import { inferPath, extractArguments, normalizePath } from '@utils';
import { showFileContent } from '@services';

export const useShowFileContent = (): ((argumentsString: string) => Promise<string>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentsString: string) => {
    const folderPath = parseArguments(argumentsString);

    const absoluteFilePath = inferPath(currentDirectory, folderPath);
    return await showFileContent(absoluteFilePath);
  };
};

const usage = 'cat FILE_PATH';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) {
    throw Error(invalidDiagnostic);
  }

  const folderPath = normalizePath(args.shift()!);

  if (args.length) throw Error(invalidDiagnostic);

  return folderPath;
};
