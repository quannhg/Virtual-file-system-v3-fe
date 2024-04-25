import { formatCreateDate } from '@utils';
import React from 'react';

export const ListDirectoryCommandResult: React.FC<{
  result: ListDirectoryItem[];
}> = ({ result }) => {
  return (
    <table className='table-auto'>
      <thead>
        <tr>
          <th className='px-4 py-2'>Name</th>
          <th className='px-4 py-2'>Create At</th>
          <th className='px-4 py-2'>Size</th>
        </tr>
      </thead>
      <tbody>
        {result.map((item) => (
          <tr key={item.name}>
            <td className={`px-4 py-2 ${item.name.endsWith('/') ? 'text-blue-500' : ''}`}>
              {item.name}
            </td>
            <td className='px-4 py-2'>{formatCreateDate(item.createAt)}</td>
            <td className='px-4 py-2'>{item.size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
