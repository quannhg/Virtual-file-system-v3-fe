import { readPwdLocalStorage } from '@utils';

export const listDirectoryContents = (): string => {
  const currentDirectory = readPwdLocalStorage();
  return 'ls is called at ' + currentDirectory;
};
