import { apiClient } from './common';

export async function updateFileDirectory(
  oldPath: string,
  newPath: string,
  newData?: string | null
) {
  const { data, error } = await apiClient.POST('/api/up', {
    body: { oldPath, newPath, newData: newData || null }
  });
  if (data) return data;
  throw Error(error.message);
}
