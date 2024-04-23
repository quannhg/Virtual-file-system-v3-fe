import { readPwdLocalStorage } from '@utils';

export const makeDirectory = (directoryName: string): string => {
  const newDirectory = readPwdLocalStorage() + '/' + directoryName;
  return 'create-directory at ' + newDirectory;
};
