import { apiClient } from './common';

export async function showFileContent(path: string) {
  const { data, error } = await apiClient.GET('/api/cat', {
    params: { query: { path } }
  });
  if (data) return data.data;
  throw Error(error.message);
}
