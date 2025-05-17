// grepFile.service.ts
import { apiClient } from './common';

type GrepResult = {
  path: string;
  content: string;
};

export async function grepFile(
  contentSearch: string,
  path: string,
  recursive: boolean = true  // 👈 Thêm tham số mới
): Promise<GrepResult[]> {
  const { data, error } = await apiClient.GET('/api/grep', {
    params: {
      query: {
        contentSearch,
        path,
        recursive: recursive ? 'true' : 'false'  // 👈 Gửi dưới dạng string
      }
    }
  });

  if (error) throw new Error(error.message);
  return data;
}
