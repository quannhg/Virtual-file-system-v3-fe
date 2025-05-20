import React from 'react';

type GrepResult = {
  path: string;
  content: string;
};

export const GrepFileCommandResult: React.FC<{
  matchingResults: GrepResult[];
  contentSearch: string;
}> = ({ matchingResults, contentSearch }) => {
  const highlightMatch = (text: string, keyword: string) => {
    if (!text || !keyword || typeof text !== 'string' || typeof keyword !== 'string') {
      return text;
    }

    try {
      const regex = new RegExp(`(${keyword})`, 'gi');
      return text.split(regex).map((part, i) =>
        regex.test(part) ? (
          <span key={i} className='text-red-500 font-semibold'>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    } catch (err) {
      console.error('Highlight error:', err);
      return text;
    }
  };

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
                <strong>Content:</strong> {highlightMatch(result.content, contentSearch)}
              </div>
            </div>
          ))}
        </div>
      )}
    </span>
  );
};
