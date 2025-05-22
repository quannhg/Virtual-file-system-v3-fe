import { logger } from '@configs';
import { RemoveFileDirectory } from '@dtos/in';
import { SingleMessageResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import {
    removeItem,
    getLastSegment,
    normalizePath,
    invalidateDirectoryCache,
    invalidateFileCache,
    getParentPath
} from '@utils';

export const removeFileDirectory: Handler<SingleMessageResult, { Querystring: RemoveFileDirectory }> = async (req, res) => {
    try {
        const paths = req.query.paths;
        if (paths.length === 0) {
            return res.unprocessableEntity('Missing required path.');
        }

        const errorMessages = [];

        for (const rawPath of paths) {
            const normalizeResult = await normalizePath(rawPath);
            if (normalizeResult.invalid) {
                errorMessages.push(normalizeResult.message);
                continue;
            }
            const removePath = normalizeResult.path;

            const firstRemoveItem = await prisma.file.findFirst({
                where: {
                    OR: [{ path: { startsWith: removePath + '/' } }, { path: removePath }]
                },
                select: {
                    path: true,
                    type: true
                }
            });
            if (!firstRemoveItem) {
                errorMessages.push(`Cannot remove ${getLastSegment(rawPath)}: File/directory not found`);
                continue;
            }

            // Get the parent path for cache invalidation
            const parentPath = getParentPath(removePath);

            // Check if it's a file to invalidate file content cache
            if (firstRemoveItem.type === FileType.RAW_FILE) {
                await invalidateFileCache(removePath);
            }

            // Invalidate directory listing cache for the parent directory
            await invalidateDirectoryCache(parentPath);

            // If it's a directory, we need to invalidate all potential file content caches
            // within this directory, but this is handled by the removeItem function

            await removeItem(removePath);
        }

        if (errorMessages.length === 0) {
            return res.send({ message: 'Successfully deleted files/directories' });
        } else {
            const errorMessage = errorMessages.join('\n');
            return res.badRequest(errorMessage);
        }
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
