import React from 'react';

type HighlightStringProps = {
  path: string;
  keyString: string;
};

const HighlightString: React.FC<HighlightStringProps> = ({ path, keyString }) => {
  const index = path.toLowerCase().lastIndexOf(keyString.toLowerCase());
  if (index === -1) return <span>{path}</span>;

  return (
    <span>
      <span>{path.slice(0, index)}</span>
      <strong className='text-red-500'>{path.slice(index, index + keyString.length)}</strong>
      <span>{path.slice(index + keyString.length)}</span>
    </span>
  );
};

export const GrepFileCommandResult: React.FC<{
  keyString: string;
  matchingPaths: string[];
}> = ({ keyString, matchingPaths }) => {
  return (
    <span className='ml-5'>
      {matchingPaths.length === 0 ? (
        <span>
          No match found for keyword "<strong>{keyString}</strong>".
        </span>
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
