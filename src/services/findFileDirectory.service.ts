import { apiClient } from './common';

export async function findFileDirectory(keyString: string, path: string): Promise<string[]> {
  const { data, error } = await apiClient.GET('/api/find', {
    params: {
      query: {
        keyString,
        path
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
