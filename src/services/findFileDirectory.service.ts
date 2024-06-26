import { apiClient } from './common';

export async function findFileDirectory(keyString: string, path: string) {
  const { data, error } = await apiClient.GET('/api/find', {
    params: { query: { keyString, path } }
  });
  if (data) return data;
  throw Error(error.message);
}
