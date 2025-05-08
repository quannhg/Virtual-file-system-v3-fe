import React from 'react';

export const GeneralCommandResult: React.FC<{ result?: string | void; error?: string }> = ({
  result,
  error
}) => {
  if (error) {
    return <span className='text-red-500'>{error}</span>;
  } else {
    return <span>{result || ''}</span>;
  }
};
