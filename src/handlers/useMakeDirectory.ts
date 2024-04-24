import { usePwdStore } from '@states';

export const useCreateFileOrDirectory = (): ((argumentsString: string) => Promise<string>) => {
  const { currentDirectory } = usePwdStore();

  return async (argumentString: string) => {
    try {
      const { path, data, createParents } = parseArguments(argumentString);

      const isValidPath = /^[a-zA-Z0-9 _/-]+$/.test(path || '');
      if (!isValidPath) {
        throw Error(
          `Invalid characters in path. Path can only contain alphanumeric characters, spaces, underscores, hyphens, and slashes.`
        );
      }

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
      throw err;
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
  let path = args[pathIndex];
  if (path && path.startsWith('"') && path.endsWith('"')) {
    path = path.slice(1, -1);
  }

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
