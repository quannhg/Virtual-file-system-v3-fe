import { readPwdLocalStorage } from '@utils';

export const createFile = (fileName: string, data?: string): string => {
  const newFile = readPwdLocalStorage() + '/' + fileName;
  return 'Create file ' + newFile + (data ? data : '');
};
