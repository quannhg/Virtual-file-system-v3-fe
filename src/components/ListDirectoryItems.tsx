import { formatCreateDate } from '@utils';
import React from 'react';
import { VscFileSymlinkDirectory } from "react-icons/vsc";

export const ListDirectoryCommandResult: React.FC<{
  result: ListDirectoryItem[];
}> = ({ result }) => {

  return (
    <table className='table-auto'>
      <thead>
        <tr>
          <th className='px-4 py-2'>Name</th>
          <th className='px-4 py-2'>Created At</th>
          <th className='px-4 py-2'>Size</th>
          <th className='px-4 py-2'>Type</th>
        </tr>
      </thead>
      <tbody>
        {result.map((item) => (
          <tr key={item.name}>
            <td
              className={`px-4 py-2 whitespace-pre ${
                item.type === 'SYMLINK' ? "text-green-500" :
                item.name.endsWith('/') ? 'text-blue-500' : ''
              }`}
            >
              {item.type === 'DIRECTORY' && '📁'}
              {item.type === 'SYMLINK' && '🔗'}
              {item.type === 'RAW_FILE' && '📄'}{' '}
              {item.name}
            </td>
            <td className='px-4 py-2'>{formatCreateDate(item.createAt)}</td>
            <td className='px-4 py-2'>{item.size}</td>
            <td className='px-4 py-2'>{item.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
