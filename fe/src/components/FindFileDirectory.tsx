import React from 'react';

type HighlightStringProps = {
  path: string;
  keyString: string;
};

const HighlightString: React.FC<HighlightStringProps> = ({ path, keyString }) => {
  const lastIndexOfKeyString = path.lastIndexOf(keyString);
  return (
    <span>
      <span>{path.slice(0, lastIndexOfKeyString)}</span>
      <span className='text-red-500'>
        {path.slice(lastIndexOfKeyString, lastIndexOfKeyString + keyString.length)}
      </span>
      <span>{path.slice(lastIndexOfKeyString + keyString.length)}</span>
    </span>
  );
};

export const FindFileDirectoryCommandResult: React.FC<{
  keyString: string;
  matchingPaths: string[];
}> = ({ keyString, matchingPaths }) => {
  return (
    <span className='ml-5'>
      {matchingPaths.length === 0 ? (
        <span>No matching results found.</span>
      ) : (
        <div className='list-disc'>
          <h2>Matching Paths:</h2>
          {matchingPaths.map((path) => (
            <div key={path} className='px-4 py-2'>
              <HighlightString path={path} keyString={keyString} />
            </div>
          ))}
        </div>
      )}
    </span>
  );
};
