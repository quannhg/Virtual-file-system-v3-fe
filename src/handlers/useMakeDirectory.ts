import { usePwdStore } from '@states';

export const useMakeDirectory = (): ((directoryName: string) => string) => {
  const { currentDirectory: pwd } = usePwdStore();

  return (directoryName: string) => {
    const newDirectory = pwd + '/' + directoryName;
    return 'create-directory at ' + newDirectory;
  };
};
