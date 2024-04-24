import {
  useChangeDirectory,
  useCreateFile,
  useListDirectoryContents,
  useMakeDirectory,
  useRemoveFile
} from '@handlers';
import { usePwdStore } from '@states';
import { ReactTerminal } from 'react-terminal';

export const Terminal = () => {
  const { currentDirectory } = usePwdStore();

  const changeDirectory = useChangeDirectory();
  const listDirectoryContents = useListDirectoryContents();
  const makeDirectory = useMakeDirectory();
  const createFile = useCreateFile();
  const removeFile = useRemoveFile();

  const welcomeMessage = (
    <span>
      Welcome to <strong>Virtual file system!</strong> Type <strong>help</strong> for all available
      commands
      <br />
      <br />
    </span>
  );

  const commands: Commands = {
    cd: async (directory: string) => await changeDirectory(directory),
    ls: () => listDirectoryContents(),
    mkdir: (directoryName: string) => makeDirectory(directoryName),
    touch: (fileName: string) => createFile(fileName),
    rm: (fileName: string) => removeFile(fileName),
    pwd: () => 'current directory'
  };

  return (
    <ReactTerminal
      className='h-max'
      commands={commands}
      prompt={'$' + currentDirectory}
      welcomeMessage={welcomeMessage}
      errorMessage={<span className='text-red-500'>Command not found</span>}
    />
  );
};
