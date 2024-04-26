import { countOccurrences } from '@utils';
import React from 'react';
import Highlighter from 'react-highlight-words';

export const FindFileDirectoryCommandResult: React.FC<{
  keyString: string;
  matchingPaths: string[];
}> = ({ keyString, matchingPaths }) => {
  return (
    <div className='ml-5'>
      <h2>Matching Paths:</h2>
      {matchingPaths.length === 0 ? (
        <p>No matching results found.</p>
      ) : (
        <ul className='list-disc'>
          {matchingPaths.map((path) => (
            <li key={path} className='px-4 py-2'>
              <Highlighter
                highlightClassName='bg-transparent'
                activeClassName='text-red-500'
                searchWords={[keyString]}
                activeIndex={countOccurrences(path, keyString) - 1}
                textToHighlight={path}
                caseSensitive={true}
                style={{ color: path.endsWith('/') ? 'blue-500' : '' }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
