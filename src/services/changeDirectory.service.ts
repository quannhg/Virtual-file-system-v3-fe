import { apiClient } from './common';

export async function changeDirectory(path: string) {
  const { data, error } = await apiClient.GET('/api/cd', {
    params: { query: { path } }
  });
  if (data) return data;
  throw Error(error.message);
}
