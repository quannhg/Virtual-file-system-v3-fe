import { moveFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, normalizePath, extractArguments } from '@utils';

export const useMoveFileDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    try {
      const { oldPath, destinationPath } = parseArguments(argumentString);

      const absoluteOldPath = inferPath(currentDirectory, oldPath);
      const absoluteDestinationPath = inferPath(currentDirectory, destinationPath);

      if (absoluteDestinationPath.includes(absoluteOldPath)) {
        throw Error(
          `Refusing to move ${absoluteOldPath} to ${absoluteDestinationPath}: Cannot move a folder to its subfolder`
        );
      }

      await moveFileDirectory(absoluteOldPath, absoluteDestinationPath);
    } catch (err) {
      throw err;
    }
  };
};

const usage = 'usage: mv PATH FOLDER_PATH';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) throw Error(invalidDiagnostic);

  const oldPath = normalizePath(args.shift()!);

  if (!args.length) throw Error(invalidDiagnostic);

  const destinationPath = normalizePath(args.shift()!);

  if (args.length > 0) throw Error(invalidDiagnostic);

  return { oldPath, destinationPath };
};
