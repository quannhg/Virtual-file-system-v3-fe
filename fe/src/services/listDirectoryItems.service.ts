import { apiClient } from './common';

export async function listDirectoryItems(path: string) {
  const { data, error } = await apiClient.GET('/api/ls', {
    params: { query: { path } }
  });
  if (data) return data;
  throw Error(error.message);
}
