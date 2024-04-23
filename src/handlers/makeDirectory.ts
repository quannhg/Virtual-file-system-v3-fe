import { fileSystem } from '@constants';
import { CommandState } from '@interfaces';

export const makeDirectory = (directoryName: string, currentState: CommandState): string => {
  const cwd = currentState.cwd;
  const currentDir = fileSystem[cwd];
  if (!currentDir || currentDir.type !== 'dir') return 'Not a directory';
  if (currentDir.children[directoryName]) return `Directory '${directoryName}' already exists`;
  currentDir.children[directoryName] = { type: 'dir', children: {} };
  return '';
};
