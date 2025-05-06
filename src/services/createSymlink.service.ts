// Thêm vào file service API của bạn

import { apiClient } from './common';

export async function createSymlink(
  targetPath: string,
  path: string,
  shouldCreateParent: boolean
) {
  const { data, error } = await apiClient.POST('/api/ln', {
    body: { 
      targetPath: targetPath, 
      path: path, 
      shouldCreateParent: shouldCreateParent 
    }
  });
  if (data) return data;
  throw Error(error.message);
}