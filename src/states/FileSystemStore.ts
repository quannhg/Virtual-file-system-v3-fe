import { FileSystem } from '@interfaces';
import { create } from 'zustand';

// Define interface for file system
interface FileSystemState {
  fileSystem: FileSystem;
  updateFileSystem: (newFileSystem: FileSystem) => void;
}

const initialFileSystem: FileSystem = {
  '/': {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          mihon: {
            type: 'dir',
            children: {
              documents: {
                type: 'dir',
                children: {
                  file1: { type: 'file', content: 'Hello world!' },
                  file2: { type: 'file', content: 'Lorem ipsum dolor sit amet.' }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const useFileSystemStore = create<FileSystemState>((set) => ({
  fileSystem: initialFileSystem,
  updateFileSystem: (newFileSystem) => set({ fileSystem: newFileSystem })
}));
