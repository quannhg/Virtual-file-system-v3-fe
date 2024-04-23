import { usePwdStore } from '@states'; // Import the PWD store

export const useRemoveFile = (): ((fileName: string) => string) => {
  const { pwd } = usePwdStore();

  return (fileName: string) => {
    const removedFileName = pwd + '/' + fileName;
    return 'remove ' + removedFileName;
  };
};
