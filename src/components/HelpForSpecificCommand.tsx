import React from 'react';

export const HelpForSpecificCommand: React.FC<{ command?: string }> = ({ command }) => {
  const commandHelpMap: { [key: string]: JSX.Element } = {
    cd: (
      <div>
        <strong>
          <span className='text-blue-300'>cd</span> FOLDER_PATH
        </strong>
        <p className='mt-4'>Change current working directory/folder to the specified FOLDER.</p>
      </div>
    ),
    cr: (
      <div>
        <strong>
          <span className='text-blue-300'>cr</span> [-p] PATH [DATA]
        </strong>
        <p className='mt-4'>
          Create a new file (if DATA is specified, otherwise create a new folder) at the specified
          PATH.
          <br />
          <br />
          <strong>If the parent folder of the destination PATH does not exist:</strong>
          <ul>
            <li>
              Bonus feature: If optional param -p is specified, create the missing parent folders.
            </li>
            <li>Else, raise an error.</li>
          </ul>
          <strong>If there is an existing file/folder at PATH, raise an error.</strong>
        </p>
      </div>
    ),
    cat: (
      <div>
        <strong>
          <span className='text-blue-300'>cat</span> FILE_PATH
        </strong>
        <p className='mt-4'>
          Show the content of a file at FILE_PATH. If there is no file at FILE_PATH, raise an error.
        </p>
      </div>
    ),
    ls: (
      <div>
        <strong>
          <span className='text-blue-300'>ls</span> [FOLDER_PATH]
        </strong>
        <p className='mt-4'>
          List out all items directly under a folder.
          <br />
          <br />
          <strong>Additional Notes:</strong>
          <ul>
            <li>
              The output list must include name, created_at, and size of each item directly under
              the current folder, and of the current folder itself.
            </li>
            <li>
              Size of a folder is the total size of all files within the folder. Size of a file is
              the number of characters in its data.
            </li>
            <li>
              If the optional param FOLDER_PATH is specified, list items in the folder at
              FOLDER_PATH. Otherwise, if omitted, list items in the current working folder.
            </li>
          </ul>
        </p>
      </div>
    ),
    find: (
      <div>
        <strong>
          <span className='text-blue-300'>find</span> NAME [FOLDER_PATH]
        </strong>
        <p className='mt-4'>
          Search all files/folders whose name contains the substring NAME.
          <br />
          <br />
          <strong>Additional Notes:</strong>
          <ul>
            <li>The command should find in subfolders as well.</li>
            <li>The result should be displayed nicely to end users.</li>
          </ul>
        </p>
      </div>
    ),
    grep: (
      <div>
        <strong>
          <span className='text-blue-300'>grep</span> CONTENT [FOLDER_PATH]
        </strong>
        <p className='mt-4'>
          Search for files whose <strong>content</strong> contains the keyword <code>CONTENT</code>.
          <br />
          <br />
          <strong>Rules:</strong>
          <ul>
            <li>CONTENT is required and must be wrapped in quotes if it contains spaces.</li>
            <li>
              If <code>FOLDER_PATH</code> is provided, the search is limited to that directory (and
              its subdirectories).
            </li>
            <li>
              If <code>FOLDER_PATH</code> is omitted, the current working directory is used.
            </li>
          </ul>
          <strong>Example:</strong> grep "hello world" /example/folder
        </p>
      </div>
    ),
    up: (
      <div>
        <strong>
          <span className='text-blue-300'>up</span> PATH NAME [DATA]
        </strong>
        <p className='mt-4'>
          Update the file/folder at PATH to have new NAME and, optionally, new DATA.
          <br />
          <br />
          <strong>Example:</strong> up /path/to/file.txt new_name "New content"
        </p>
      </div>
    ),
    mv: (
      <div>
        <strong>
          <span className='text-blue-300'>mv</span> PATH FOLDER_PATH
        </strong>
        <p className='mt-4'>
          Move a file/folder at PATH into the destination FOLDER_PATH.
          <br />
          <br />
          <strong>Raise an error if:</strong>
          <ul>
            <li>There is no folder at FOLDER_PATH.</li>
            <li>
              FOLDER_PATH is a sub-path of PATH. In other words, cannot move a folder to become a
              subfolder of itself.
            </li>
          </ul>
        </p>
      </div>
    ),
    rm: (
      <div>
        <strong>
          <span className='text-blue-300'>rm</span> PATH [PATH2 PATH3...]
        </strong>
        <p className='mt-4'>Remove files/folders at the specified PATH(s).</p>
      </div>
    )
  };

  return (
    <div>
      {command ? (
        commandHelpMap[command]
      ) : (
        <div>
          <h2>Available Commands:</h2>
          <ul>
            {Object.entries(commandHelpMap).map(([cmd, help]) => (
              <li key={cmd}>{help}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
