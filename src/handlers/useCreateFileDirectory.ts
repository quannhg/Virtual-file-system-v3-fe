import { createFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, removeQuotes as removeQuotes, extractArguments, normalizePath } from '@utils';

export const useCreateFileOrDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const { path, data, shouldCreateParents } = parseArguments(argumentString);

    const newPath = inferPath(currentDirectory, path);

    await createFileDirectory(newPath, shouldCreateParents, data);
  };
};

const usage = 'Usage: cr [-p] PATH [DATA]';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) {
    throw Error(invalidDiagnostic);
  }

  let shouldCreateParents = false;
  if (args[0] === '-p') {
    shouldCreateParents = true;
    args.shift();
  }

  if (args.length === 0) {
    throw Error(invalidDiagnostic);
  }

  const path = normalizePath(args.shift()!);

  const data = removeQuotes(args.shift() || '') || null;

  if (args.length > 0) {
    throw Error(invalidDiagnostic);
  }

  return { path, data, shouldCreateParents };
};
