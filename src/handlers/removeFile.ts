import { readPwdLocalStorage } from '@utils';

export const removeFile = (fileName: string): string => {
  const removedFileName = readPwdLocalStorage() + '/' + fileName;
  return 'remove ' + removedFileName;
};
