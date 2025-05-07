import React from 'react';

export const HelpCommand: React.FC = () => {
  return (
    <div>
      <h2 className='mt-1 mb-4'>Available Commands:</h2>
      <ul>
        <li>
          <strong>
            <span className='text-blue-300'>cd</span> FOLDER_PATH:
          </strong>{' '}
          Change current working directory/folder to the specified FOLDER.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>cr</span> [-p] PATH [DATA]:
          </strong>{' '}
          Create a new file (if DATA is specified, otherwise create a new folder) at the specified
          PATH.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>cat</span> FILE_PATH:
          </strong>{' '}
          Show the content of a file at FILE_PATH.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>ls</span> [FOLDER_PATH]:
          </strong>{' '}
          List out all items directly under a folder.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>find</span> NAME [FOLDER_PATH]:
          </strong>{' '}
          Search all files/folders whose name contains the substring NAME.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>up</span> PATH NAME [DATA]:
          </strong>{' '}
          Update the file/folder at PATH to have new NAME and, optionally, new DATA.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>mv</span> PATH FOLDER_PATH:
          </strong>{' '}
          Move a file/folder at PATH into the destination FOLDER_PATH.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>ln</span> [-p] PATH TARGET_PATH:
          </strong>{' '}
          Create a new file or directory that symlink to specified targetPath.
        </li>
        <li>
          <strong>
            <span className='text-blue-300'>rm</span> PATH [PATH2 PATH3...]:
          </strong>{' '}
          Remove files/folders at the specified PATH(s).
        </li>
      </ul>

      <h2 className='mt-4'>
        Enter{' '}
        <strong>
          <span className='text-blue-300'>[command]</span> -h/--help
        </strong>{' '}
        for detail information of each command
      </h2>
    </div>
  );
};
