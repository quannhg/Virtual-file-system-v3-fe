import { apiClient } from './common';

export async function moveFileDirectory(oldPath: string, destinationPath: string) {
  const { data, error } = await apiClient.PUT('/api/mv', {
    body: { oldPath, destinationPath }
  });
  if (data) return data;
  throw Error(error.message);
}
