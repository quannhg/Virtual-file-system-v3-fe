import {
  useChangeDirectory,
  useListDirectoryItems,
  useCreateFileOrDirectory,
  useRemoveFile,
  useShowFileContent,
  useUpdateFileOrDirectory
} from '@handlers';
import { usePwdStore } from '@states';
import { ReactTerminal } from 'react-terminal';
import { GeneralCommandResult } from './GeneralCommandResult';
import { ListDirectoryCommandResult } from './ListDirectoryItems';

const handleCommandError = (err: Error | unknown) => {
  if (err instanceof Error && err.message) {
    return <GeneralCommandResult error={err.message} />;
  } else {
    return <GeneralCommandResult error='An error occurred while executing the command.' />;
  }
};

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
    return handleCommandError(err);
  }
};

export const Terminal = () => {
  const { currentDirectory } = usePwdStore();

  const changeDirectory = useChangeDirectory();
  const createFileOrDirectory = useCreateFileOrDirectory();
  const showFileContent = useShowFileContent();
  const updateFileDirectory = useUpdateFileOrDirectory();
  const listDirectoryItems = useListDirectoryItems();
  const removeFile = useRemoveFile();

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
      return handleCommandError(err);
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
