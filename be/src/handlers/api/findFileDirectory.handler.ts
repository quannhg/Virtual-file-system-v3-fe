import { logger } from '@configs';
import { DIRECTORY_NOT_FOUND, PATH_IS_REQUIRED } from '@constants';
import { FindFileDirectoryQueryStrings } from '@dtos/in';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { normalizePath } from '@utils';
import { ListDirectoryItem } from '@dtos/out';

export const findDirectoryItems: Handler<ListDirectoryItem[], { Querystring: FindFileDirectoryQueryStrings }> = async (req, res) => {
    const { keyString, path: rawPath, contentSearch } = req.query;

    if (!rawPath) {
        return res.unprocessableEntity(PATH_IS_REQUIRED);
    }

    const normalizeResult = await normalizePath(rawPath);
    if (normalizeResult.invalid) {
        return res.badRequest(normalizeResult.message);
    }
    const path = normalizeResult.path + '/';

    try {
        const exactFile = await prisma.file.findFirst({
            where: {
                path: path.slice(0, -1),
                type: 'RAW_FILE'
            }
        });
        if (exactFile) {
            return res.status(400).send({ message: 'Path must refer to a directory, not a file' });
        }

        const folderExist = await prisma.file.findFirst({
            where: {
                OR: [{ path: path.slice(0, -1), type: 'DIRECTORY' }, { path: { startsWith: path } }]
            }
        });
        if (!folderExist) {
            return res.status(400).send({ message: DIRECTORY_NOT_FOUND });
        }

        // Nested query: Lấy tất cả file trong thư mục
        const filesInDirectory = await prisma.file.findMany({
            where: {
                path: { startsWith: path },
                type: 'RAW_FILE'
            },
            select: { path: true } // Chỉ cần path để xác định file
        });

        // Composite condition: Tìm file có nội dung (trong Content) chứa contentSearch hoặc keyString
        const matchingFiles = await prisma.file.findMany({
            where: {
                path: { in: filesInDirectory.map((f) => f.path) }, // Nested query
                type: 'RAW_FILE',
                OR: [
                    {
                        Content: {
                            some: {
                                data: { contains: contentSearch || keyString }
                            }
                        }
                    },
                    { name: { contains: keyString } }
                ]
            },
            select: {
                name: true,
                createdAt: true,
                size: true
            }
        });

        // Trả về danh sách file
        return res.send(
            matchingFiles.map((file) => ({
                name: file.name,
                createdAt: file.createdAt.toISOString(),
                size: file.size || 0
            }))
        );
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
