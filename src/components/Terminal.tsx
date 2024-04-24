import {
  useChangeDirectory,
  useListDirectoryContents,
  useCreateFileOrDirectory,
  useRemoveFile,
  useShowFileContent
} from '@handlers';
import { usePwdStore } from '@states';
import { ReactTerminal } from 'react-terminal';
import { GeneralCommandResult } from './GeneralCommandResult';

export const Terminal = () => {
  const { currentDirectory } = usePwdStore();

  const changeDirectory = useChangeDirectory();
  const createFileOrDirectory = useCreateFileOrDirectory();
  const showFileContent = useShowFileContent();
  const listDirectoryContents = useListDirectoryContents();
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
        return <GeneralCommandResult error={err.message} />;
      } else {
        return (
          <GeneralCommandResult error='An error occurred while creating a new file/directory.' />
        );
      }
    }
  };

  const cr = async (argumentsString: string) => {
    try {
      await createFileOrDirectory(argumentsString);
    } catch (err) {
      if (err instanceof Error && err.message) {
        return <GeneralCommandResult error={err.message} />;
      } else {
        return (
          <GeneralCommandResult error='An error occurred while creating a new file/directory.' />
        );
      }
    }
  };

  const cat = async (filePath: string) => {
    try {
      const fileContent = await showFileContent(filePath);
      return <GeneralCommandResult result={fileContent} />;
    } catch (err) {
      if (err instanceof Error && err.message) {
        return <GeneralCommandResult error={err.message} />;
      } else {
        return (
          <GeneralCommandResult error='An error occurred while creating a new file/directory.' />
        );
      }
    }
  };

  const commands: Commands = {
    cd,
    cr,
    cat,
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
