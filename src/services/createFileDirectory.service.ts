import { apiClient } from './common';

export async function createFileDirectory(path: string, raw_data?: string | null) {
  const { data, error } = await apiClient.POST('/api/cr', {
    body: { path: path, data: raw_data || null }
  });
  if (data) return data;
  throw Error(error.message);
}
