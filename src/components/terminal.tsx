import {
  changeDirectory,
  createFile,
  listDirectoryContents,
  makeDirectory,
  removeFile
} from '@handlers';
import { ReactTerminal } from 'react-terminal';

export const Terminal = () => {
  const welcomeMessage = (
    <span>
      Welcome to <strong>Virtual file system!</strong> Type <strong>help</strong> for all available
      commands
      <br />
      <br />
    </span>
  );

  const commands: Commands = {
    cd: (directory: string) => changeDirectory(directory),
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
      prompt={'$'}
      welcomeMessage={welcomeMessage}
      errorMessage={<span className='text-red-500'>Command not found</span>}
    />
  );
};
