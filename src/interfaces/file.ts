export interface File {
  type: 'file';
  content: string;
}

export interface Directory {
  type: 'dir';
  children: { [name: string]: File | Directory };
}

export interface FileSystem {
  [path: string]: Directory;
}

export interface CommandState {
  cwd: string;
}
