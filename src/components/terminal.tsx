import {
  changeDirectory,
  listDirectoryContents,
  makeDirectory,
  createFile,
  removeFile
} from '@handlers';
import { CommandState } from '@interfaces';
import { ReactTerminal } from 'react-terminal';

export const Terminal = () => {
  const commands: {
    [name: string]: (arg: string, currentState: CommandState) => string | CommandState;
  } = {
    hcm: () => 'co em',
    cd: (directory: string, currentState: CommandState) => changeDirectory(directory, currentState),
    ls: (args: string, currentState: CommandState) => listDirectoryContents(currentState),
    mkdir: (directoryName: string, currentState: CommandState) =>
      makeDirectory(directoryName, currentState),
    touch: (fileName: string, currentState: CommandState) => createFile(fileName, currentState),
    rm: (fileName: string, currentState: CommandState) => removeFile(fileName, currentState),
    pwd: (args: string, currentState: CommandState) => currentState
  };
  const initialCommandState: CommandState = { cwd: '/' };

  return (
    <ReactTerminal
      className='h-max'
      commands={commands}
      theme='dark'
      prompt={`mihon@root:~$`}
      welcomeMessage={
        <div>Welcome to Virtual file system! Type "help" for all available commands</div>
      }
      initialCommandState={initialCommandState}
    />
  );
};
