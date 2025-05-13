// grepFile.service.ts
import { apiClient } from './common';

type GrepResult = {
  path: string;
  content: string;
};

export async function grepFile(
  contentSearch: string,
  path: string
): Promise<GrepResult[]> {
  const { data, error } = await apiClient.GET('/api/grep', {
    params: {
      query: {
        contentSearch,
        path
      }
    }
  });

  if (error) throw new Error(error.message);
  return data;
}
