import { FileSystem } from "@interfaces";

export const fileSystem: FileSystem = {
  '/': {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          jackharper: {
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
