import { usePwdStore } from '@states';

export const useCreateFileOrDirectory = (): ((argumentsString: string) => Promise<string>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    try {
      const { path, data, createParents } = parseArguments(argumentString);

      if (!createParents && path && path.includes('/')) {
        throw new Error(`Cannot create parent directory! Add '-p' to create parent directory.`);
      }

      const newPath = currentDirectory + '/' + path;

      if (data) {
        return `create file "${newPath}" with data: "${data}"`;
      } else {
        return `create directory "${newPath}"`;
      }
    } catch (err) {
      if (err instanceof Error && err.message) {
        return err.message;
      } else {
        return 'An error occurred while create new file/directory.';
      }
    }
  };
};

const parseArguments = (argumentString: string) => {
  const args = argumentString.trim().match(/"([^"]+)"|\S+/g) || [];

  if (args.length === 0) {
    throw Error(`Missing 'path' argument`);
  }

  const createParents = args[0] === '-p';
  const pathIndex = createParents ? 1 : 0;
  const path = args[pathIndex];

  const minimumLen = createParents ? 2 : 1;

  if (args.length < minimumLen) {
    throw Error(`Missing 'path' argument`);
  }

  if (args.length > minimumLen + 1) {
    throw Error(`Unrecognized argument(s): ${args.slice(minimumLen + 1).join(', ')}`);
  }

  let data = null;
  if (args.length === minimumLen + 1) {
    data = args[minimumLen];

    if (data && data.startsWith('"') && data.endsWith('"')) {
      data = data.slice(1, -1);
    }
  }

  return { path, data, createParents };
};
