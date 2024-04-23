import { fileSystem } from '@constants';
import { CommandState } from '@interfaces';

export const removeFile = (fileName: string, currentState: CommandState): string => {
  const cwd = currentState.cwd;
  const currentDir = fileSystem[cwd];
  if (!currentDir || currentDir.type !== 'dir') return 'Not a directory';
  if (!currentDir.children[fileName]) return `File '${fileName}' not found`;
  delete currentDir.children[fileName];
  return '';
};
