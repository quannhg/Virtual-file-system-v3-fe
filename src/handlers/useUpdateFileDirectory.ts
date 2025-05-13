import { updateFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, removeQuotes, normalizePath, extractArguments } from '@utils';

export const useUpdateFileOrDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
      const { oldPath, newPath, newData } = parseArguments(argumentString);

      const absoluteOldPath = inferPath(currentDirectory, oldPath);
      const absoluteNewPath = inferPath(currentDirectory, newPath);

      await updateFileDirectory(absoluteOldPath, absoluteNewPath, newData);
    }
  };

const usage = 'Usage: up PATH NAME [DATA]';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) throw Error(invalidDiagnostic);
  const oldPath = normalizePath(args.shift()!);

  if (!args.length) throw Error(invalidDiagnostic);
  const newPath = normalizePath(args.shift()!);

  let newData = null;
  if (args.length > 0) {
    newData = removeQuotes(args.shift()!);
  }

  if (args.length) throw Error(invalidDiagnostic);

  return { oldPath, newPath, newData };
};
