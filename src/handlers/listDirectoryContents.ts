import { fileSystem } from '@constants';
import { CommandState } from '@interfaces';

export const listDirectoryContents = (currentState: CommandState): string => {
  const cwd = currentState.cwd;
  const currentDir = fileSystem[cwd];
  if (!currentDir || currentDir.type !== 'dir') return 'Not a directory';
  return Object.keys(currentDir.children).join('\n');
};
