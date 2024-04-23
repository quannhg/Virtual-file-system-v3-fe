import { usePwdStore } from '@states';

export const useListDirectoryContents = (): (() => string) => {
  const { pwd } = usePwdStore();

  return () => {
    return 'ls is called at ' + pwd;
  };
};
