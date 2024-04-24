import {
  useChangeDirectory,
  useListDirectoryContents,
  useCreateFileOrDirectory,
  useRemoveFile
} from '@handlers';
import { usePwdStore } from '@states';
import { ReactTerminal } from 'react-terminal';
import { CommandResult } from './CommandResult';

export const Terminal = () => {
  const { currentDirectory } = usePwdStore();

  const changeDirectory = useChangeDirectory();
  const listDirectoryContents = useListDirectoryContents();
  const createFileOrDirectory = useCreateFileOrDirectory();
  const removeFile = useRemoveFile();

  const welcomeMessage = (
    <span>
      Welcome to <strong>Virtual file system!</strong> Type <strong>help</strong> for all available
      commands
      <br />
      <br />
    </span>
  );

  const cd = async (directory: string) => {
    try {
      await changeDirectory(directory);
    } catch (err) {
      if (err instanceof Error && err.message) {
        return <CommandResult error={err.message} />;
      } else {
        return <CommandResult error='An error occurred while creating a new file/directory.' />;
      }
    }
  };

  const cr = async (argumentsString: string) => {
    try {
      const information = await createFileOrDirectory(argumentsString);
      return <CommandResult result={information} />;
    } catch (err) {
      if (err instanceof Error && err.message) {
        return <CommandResult error={err.message} />;
      } else {
        return <CommandResult error='An error occurred while creating a new file/directory.' />;
      }
    }
  };

  const commands: Commands = {
    cd,
    cr,
    ls: () => listDirectoryContents(),
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
