import React from 'react';

type GrepResult = {
  path: string;
  content: string;
};

export const GrepFileCommandResult: React.FC<{
  matchingResults: GrepResult[];
}> = ({ matchingResults }) => {
  return (
    <span className='ml-5'>
      {matchingResults.length === 0 ? (
        <span>No matching files found.</span>
      ) : (
        <div>
          <h2>Matching Files:</h2>
          {matchingResults.map((result) => (
            <div key={result.path} className='py-2'>
              <div className='text-blue-500'>{result.path}</div>
              <div>
                <strong>Content:</strong> {result.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </span>
  );
};
