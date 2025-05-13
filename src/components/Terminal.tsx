import {
  useChangeDirectory,
  useListDirectoryItems,
  useCreateFileOrDirectory,
  useRemoveFileDirectory,
  useShowFileContent,
  useUpdateFileOrDirectory,
  useMoveFileDirectory,
  useFindFileDirectory,
  useCreateSymlink,
  useGrepFile
} from '@handlers';
import { usePwdStore } from '@states';
import { ReactTerminal } from 'react-terminal';
import { GeneralCommandResult } from './GeneralCommandResult';
import { ListDirectoryCommandResult } from './ListDirectoryItems';
import { CommandError } from './CommandError';
import { HelpCommand } from './HelpCommand';
import { HelpForSpecificCommand } from './HelpForSpecificCommand';
import { FindFileDirectoryCommandResult } from './FindFileDirectory';
import { GrepFileCommandResult } from './GrepFileCommandResult';
const executeCommand = async (
  commandFunction: (argumentsString: string) => Promise<void | string>,
  argumentsString: string,
  commandName?: string
) => {
  try {
    if (commandName && (argumentsString === '--help' || argumentsString === '-h'))
      return <HelpForSpecificCommand command={commandName} />;

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

  const createSymLink = useCreateSymlink();
  const changeDirectory = useChangeDirectory();
  const createFileOrDirectory = useCreateFileOrDirectory();
  const showFileContent = useShowFileContent();
  const listDirectoryItems = useListDirectoryItems();
  const findFileDirectory = useFindFileDirectory();
  const updateFileDirectory = useUpdateFileOrDirectory();
  const moveFileDirectory = useMoveFileDirectory();
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
      if (directory === '--help' || directory === '-h')
        return <HelpForSpecificCommand command={'ls'} />;

      const directoryItems = await listDirectoryItems(directory);
      return <ListDirectoryCommandResult result={directoryItems} />;
    } catch (err) {
      return <CommandError error={err} />;
    }
  };

  const find = async (argumentString: string) => {
    try {
      if (argumentString === '--help' || argumentString === '-h')
        return <HelpForSpecificCommand command={'find'} />;

      const result = await findFileDirectory(argumentString);
      return (
        <FindFileDirectoryCommandResult
          keyString={result.keyString}
          matchingPaths={result.matchingPaths}
        />
      );
    } catch (err) {
      return <CommandError error={err} />;
    }
  };
  const grepFile = useGrepFile(); // ✅ gọi ở đúng vị trí

  const grep = async (argumentString: string) => {
    try {
      if (argumentString === '--help' || argumentString === '-h') {
        return <HelpForSpecificCommand command={'grep'} />;
      }

      const result = await grepFile(argumentString); // ✅ dùng như thường
      return (
        <GrepFileCommandResult keyString={result.keyString} matchingPaths={result.matchingPaths} />
      );
    } catch (err) {
      return <CommandError error={err} />;
    }
  };
  const commands: Commands = {
    cd: async (directory: string) => {
      return await executeCommand(changeDirectory, directory, 'cd');
    },
    cr: async (argumentsString: string) => {
      return await executeCommand(createFileOrDirectory, argumentsString, 'cr');
    },
    cat: async (filePath: string) => {
      const log = await executeCommand(showFileContent, filePath, 'cat');
      console.log('log: ', log);
      return log;
    },
    ln: async (argumentsString: string) => {
      return await executeCommand(createSymLink, argumentsString, 'ln');
    },
    up: async (argumentsString: string) => {
      return await executeCommand(updateFileDirectory, argumentsString, 'up');
    },
    ls,
    find,
    grep,
    mv: async (argumentsString: string) => {
      return await executeCommand(moveFileDirectory, argumentsString, 'mv');
    },
    rm: async (paths: string) => {
      return await executeCommand(removeFileDirectory, paths, 'rm');
    },
    help: (argumentsString?: string) => {
      if (argumentsString) return <CommandError error={Error('Invalid arguments')} />;
      return <HelpCommand />;
    }
  };

  return (
    <ReactTerminal
      className='h-max'
      commands={commands}
      prompt={
        <span>
          {currentDirectory || '/'} <span className='text-gray-500'>$</span>
        </span>
      }
      welcomeMessage={welcomeMessage}
      errorMessage={<span className='text-red-500'>Command not found</span>}
    />
  );
};
