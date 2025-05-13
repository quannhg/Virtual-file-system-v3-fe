import { listDirectoryItems } from '@services';
import { usePwdStore } from '@states';
import { inferPath, extractArguments, normalizePath } from '@utils';

export const useListDirectoryItems = (): ((
  directory: string | undefined
) => Promise<ListDirectoryItem[]>) => {
  const { currentDirectory } = usePwdStore();

  return async (directory: string | undefined) => {
    const args = extractArguments(directory || '');

    if (!args) {
      throw Error('Invalid arguments\nUsage: ls [FOLDER_PATH]');
    }

    const folderPath = normalizePath(args.shift() || '');

    if (args.length > 0) {
      throw Error('Invalid arguments\nUsage: ls [FOLDER_PATH]');
    }

    const targetDirectory = inferPath(currentDirectory, folderPath);

    // Đảm bảo kết quả trả về có trường type
    const items = await listDirectoryItems(targetDirectory);
    return items.map(item => ({
      type: item.type, // hoặc xác định type dựa trên logic của ứng dụng
      name: item.name,
      createAt: item.createAt,
      size: item.size
    }));
  };
};