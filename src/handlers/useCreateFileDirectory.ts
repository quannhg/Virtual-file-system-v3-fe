import { createFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, cleanArgument as removeQuotes, extractArguments, normalizePath } from '@utils';

export const useCreateFileOrDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const { path, data, createParents } = parseArguments(argumentString);

    if (!createParents && path && path.includes('/')) {
      throw Error(`Add '-p' to create missing parent directories.`);
    }

    const newPath = inferPath(currentDirectory, path);

    await createFileDirectory(newPath, data);
  };
};

const usage = 'Usage: cr [-p] PATH [DATA]';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) {
    throw Error(invalidDiagnostic);
  }

  let shouldCreateParents = false
  if (args[0] === '-p') {
    shouldCreateParents = true;
    args.shift();
  }

  if (args.length === 0) {
    throw Error(invalidDiagnostic);
  }

  const path = normalizePath(args.shift()!);

  let data = null;
  if (args.length > 0) {
    data = removeQuotes(args.shift()!);
  }

  if (args.length > 0) {
    throw Error(invalidDiagnostic);
  }

  return { path, data, createParents: shouldCreateParents };
};
