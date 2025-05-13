import { apiClient } from './common';

export async function grepFile(
  keyString: string,
  path: string,
  contentSearch?: string
): Promise<string[]> {
  const { data, error } = await apiClient.GET('/api/grep', {
    params: {
      query: {
        keyString,
        path,
        ...(contentSearch ? { contentSearch } : {})
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
