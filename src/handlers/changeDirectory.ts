import { fileSystem } from '@constants';
import { CommandState } from '@interfaces';

export const changeDirectory = (
  directory: string,
  currentState: CommandState
): string | CommandState => {
  let newPath = directory;
  if (directory === '..') {
    newPath = currentState.cwd.split('/').slice(0, -1).join('/');
  }
  if (!newPath.startsWith('/')) {
    newPath = currentState.cwd + '/' + newPath;
  }
  if (!newPath.endsWith('/')) {
    newPath += '/';
  }
  const targetDirectory = fileSystem[newPath];
  if (targetDirectory && targetDirectory.type === 'dir') {
    return { cwd: newPath };
  } else {
    return `Directory '${newPath}' not found`;
  }
};
