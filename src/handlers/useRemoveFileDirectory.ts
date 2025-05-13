import { removeFileDirectory } from '@services';
import { usePwdStore } from '@states';
import { inferPath, extractArguments, normalizePath } from '@utils';

export const useRemoveFileDirectory = (): ((argumentsString: string) => Promise<void>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    const errorMessages = [];
    try {
      const paths = parseArguments(argumentString);
      const absolutePaths = [];

      for (const path of paths) {
        const absoluteRemovePath = inferPath(currentDirectory, path);
        if (currentDirectory.includes(absoluteRemovePath)) {
          errorMessages.push(`Refusing to remove ${path}: Cannot remove parent folder`);
        } else {
          absolutePaths.push(absoluteRemovePath);
        }
      }

      if (absolutePaths.length > 0) await removeFileDirectory(absolutePaths);
    } catch (err) {
      if (errorMessages.length > 0 && err instanceof Error && err.message) {
        throw Error([err.message, ...errorMessages].join('\n'));
      }

      throw err;
    }

    if (errorMessages.length > 0) {
      throw Error(errorMessages.join('\n'));
    }
  };
};

const usage = 'Usage: rm PATH [PATH2 PATH3...]';
const invalidDiagnostic = `Invalid arguments\n${usage}`;

const parseArguments = (argumentString: string) => {
  const args = extractArguments(argumentString);

  if (!args?.length) {
    throw Error(invalidDiagnostic);
  }

  return args.map(normalizePath);
};
