import React from 'react';
import { GeneralCommandResult } from './GeneralCommandResult';

interface HandleCommandErrorProps {
  error: Error | unknown;
}

export const CommandError: React.FC<HandleCommandErrorProps> = ({ error }) => {
  if (error instanceof Error && error.message) {
    const errorMessages = error.message.split('\n');
    return (
      <span>
        {errorMessages.slice(0, -1).map((message, index) => (
          <div key={index}>
            <GeneralCommandResult error={message} />
          </div>
        ))}
        <GeneralCommandResult error={errorMessages[errorMessages.length - 1]} />
      </span>
    );
  } else {
    return <GeneralCommandResult error='An error occurred while executing the command.' />;
  }
};
