import { usePwdStore } from '@states'; // Import the PWD store

export const useCreateFile = (): ((fileName: string, data?: string) => string) => {
  const { currentDirectory: pwd } = usePwdStore(); // Use the PWD store hook

  return (fileName: string, data?: string) => {
    const newFile = pwd + '/' + fileName;
    return 'Create file ' + newFile + (data ? data : '');
  };
};
