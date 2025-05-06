import { createSymlink } from '@services';
import { usePwdStore } from '@states';
import { inferPath, removeQuotes, extractArguments, normalizePath } from '@utils';

export const useCreateSymlink = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const {path, targetPath, shouldCreateParents } = parseArguments(argumentString);

    const newPath = inferPath(currentDirectory, path);
    const normalizedTargetPath = inferPath(currentDirectory, targetPath);

    await createSymlink(normalizedTargetPath, newPath, shouldCreateParents);
  };
};

const usage = 'Usage: ln [-p] PATH TARGET_PATH';
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

  if (args.length < 2) {
    throw Error(invalidDiagnostic);
  }

  const path = normalizePath(args.shift()!);
  const targetPath = normalizePath(args.shift()!);

  if (args.length > 0) {
    throw Error(invalidDiagnostic);
  }

  return { path, targetPath, shouldCreateParents };
};