import {
  useChangeDirectory,
  useListDirectoryItems,
  useCreateFileOrDirectory,
  useRemoveFileDirectory,
  useShowFileContent,
  useUpdateFileOrDirectory
} from '@handlers';
import { usePwdStore } from '@states';
import { ReactTerminal } from 'react-terminal';
import { GeneralCommandResult } from './GeneralCommandResult';
import { ListDirectoryCommandResult } from './ListDirectoryItems';
import { CommandError } from './CommandError';

const executeCommand = async (
  commandFunction: (argumentsString: string) => Promise<void | string>,
  argumentsString: string
) => {
  try {
    const result = await commandFunction(argumentsString);
    if (typeof result === 'string') {
      return <GeneralCommandResult result={result} />;
    }
  } catch (err) {
    return <CommandError error={err} />;
  }
};

export const Terminal = () => {
  const { currentDirectory } = usePwdStore();

  const changeDirectory = useChangeDirectory();
  const createFileOrDirectory = useCreateFileOrDirectory();
  const showFileContent = useShowFileContent();
  const updateFileDirectory = useUpdateFileOrDirectory();
  const listDirectoryItems = useListDirectoryItems();
  const removeFileDirectory = useRemoveFileDirectory();

  const welcomeMessage = (
    <span>
      Welcome to <strong>Virtual file system!</strong> Type <strong>help</strong> for all available
      commands
      <br />
      <br />
    </span>
  );

  const ls = async (directory: string) => {
    try {
      const directoryItems = await listDirectoryItems(directory);
      return <ListDirectoryCommandResult result={directoryItems} />;
    } catch (err) {
      return <CommandError error={err} />;
    }
  };

  const commands: Commands = {
    cd: async (directory: string) => {
      return await executeCommand(changeDirectory, directory);
    },
    cr: async (argumentsString: string) => {
      return await executeCommand(createFileOrDirectory, argumentsString);
    },
    cat: async (filePath: string) => {
      return await executeCommand(showFileContent, filePath);
    },
    up: async (argumentsString: string) => {
      return await executeCommand(updateFileDirectory, argumentsString);
    },
    ls,
    rm: async (paths: string) => {
      return await executeCommand(removeFileDirectory, paths);
    },
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
