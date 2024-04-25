import { apiClient } from './common';

export async function removeFileDirectory(paths: string[]) {
  const { data, error } = await apiClient.DELETE('/api/rm', {
    params: { query: { paths } }
  });
  if (data) return data;
  throw Error(error.message);
}
