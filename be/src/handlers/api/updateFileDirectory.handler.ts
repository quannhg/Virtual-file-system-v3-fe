import { logger } from '@configs';
import { FILE_NOT_FOUND, FILE_OR_DIRECTORY_NOT_FOUND } from '@constants';
import { UpdateFileDirectoryBody } from '@dtos/in';
import { SingleMessageResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { normalizePath, invalidateFileCache, invalidateDirectoryCache, deleteCache, cacheKeys, getParentPath } from '@utils';
import path from 'path';
import { appendPath } from 'src/utils/appendPath';
import { checkExistingPath } from 'src/utils/checkExistingPath';

export const updateFileDirectory: Handler<SingleMessageResult, { Body: UpdateFileDirectoryBody }> = async (req, res) => {
    const { oldPath: rawOldPath, newPath: rawNewPath, newData } = req.body;

    if (!rawOldPath || !rawNewPath) {
        return res.unprocessableEntity("Please provide both 'old' and 'new' path.");
    }

    const oldPathNormalizeResult = await normalizePath(rawOldPath);
    const newPathNormalizeResult = await normalizePath(rawNewPath);
    if (oldPathNormalizeResult.invalid) {
        return res.badRequest(oldPathNormalizeResult.message);
    }
    if (newPathNormalizeResult.invalid) {
        return res.badRequest(newPathNormalizeResult.message);
    }

    const oldPath = oldPathNormalizeResult.path;
    const newPath = newPathNormalizeResult.path;

    if (path.dirname(oldPath) !== path.dirname(newPath)) {
        return res.badRequest('Update only supported change name of item at last segment! Using mv to change parent directory instead.');
    }

    try {
        if (newData) {
            const updatedFile = await prisma.file.findFirst({
                where: {
                    path: oldPath
                },
                select: {
                    path: true,
                    type: true
                }
            });

            if (!updatedFile) return res.notFound(FILE_NOT_FOUND);

            if (updatedFile.type === FileType.DIRECTORY) {
                return res.badRequest('Cannot add data to a directory. Only files can have data.');
            }

            if (oldPath !== newPath) {
                const existingPath = await checkExistingPath(newPath);
                if (existingPath) {
                    return res.badRequest(`File or directory already exists at path: ${existingPath}`);
                }
            }

            await prisma.$transaction(async (prisma) => {
                // Update the file path
                await prisma.file.update({
                    where: {
                        path: oldPath
                    },
                    data: {
                        path: newPath
                    }
                });

                // Update the content
                await prisma.content.upsert({
                    where: {
                        path: newPath
                    },
                    update: {
                        data: newData
                    },
                    create: {
                        path: newPath,
                        data: newData
                    }
                });

                // Update all symlinks pointing to this file
                await updateSymlinksPointingTo(prisma, oldPath, newPath);
            });

            // Invalidate cache for both old and new paths
            await invalidateFileCache(oldPath);
            await invalidateFileCache(newPath);
            await invalidateDirectoryCache(path.dirname(oldPath));
            await invalidateDirectoryCache(path.dirname(newPath));

            // Invalidate cache for the parent directory to ensure ls shows the new file/directory
            const parentPath = getParentPath(newPath);
            await invalidateDirectoryCache(parentPath);

            return res.send({ message: 'Successfully updated file and symlinks' });
        } else {
            const updateItems = await prisma.file.findMany({
                where: {
                    OR: [{ path: { startsWith: oldPath + '/' } }, { path: oldPath }]
                },
                select: {
                    path: true,
                    type: true
                }
            });

            if (updateItems.length === 0) {
                return res.notFound(FILE_OR_DIRECTORY_NOT_FOUND);
            }

            const existingPath = await checkExistingPath(newPath);
            if (existingPath) {
                return res.badRequest(`File or directory already exists at path: ${existingPath}`);
            }

            await prisma.$transaction(async (prisma) => {
                for (const item of updateItems) {
                    const absoluteNewPath = appendPath(newPath, item.path.slice(oldPath.length, item.path.length));

                    // Update the file path
                    await prisma.file.update({
                        where: {
                            path: item.path
                        },
                        data: {
                            path: absoluteNewPath
                        }
                    });

                    // If this is a regular file or directory (not a symlink itself)
                    // update any symlinks pointing to it
                    if (item.type !== FileType.SYMLINK) {
                        await updateSymlinksPointingTo(prisma, item.path, absoluteNewPath);
                    }

                    // Invalidate cache for each updated path
                    await invalidateFileCache(item.path);
                    await invalidateFileCache(absoluteNewPath);
                    await invalidateDirectoryCache(path.dirname(item.path));
                    await invalidateDirectoryCache(path.dirname(absoluteNewPath));

                    // Invalidate cache for the parent directory to ensure ls shows the new file/directory
                    const parentPath = getParentPath(absoluteNewPath);
                    await invalidateDirectoryCache(parentPath);
                }
            });

            return res.send({ message: 'Successfully updated file/directory and symlinks' });
        }
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};

/**
 * Updates all symlinks that point to the old path to point to the new path
 *
 * @param prismaClient - Prisma client transaction instance
 * @param oldTargetPath - The old path that symlinks are pointing to
 * @param newTargetPath - The new path that symlinks should point to
 */
async function updateSymlinksPointingTo(prismaClient: any, oldTargetPath: string, newTargetPath: string) {
    // Find all symlinks that point to the old path
    const symlinks = await prismaClient.file.findMany({
        where: {
            type: FileType.SYMLINK,
            targetPath: oldTargetPath
        }
    });

    // Update each symlink to point to the new path
    for (const symlink of symlinks) {
        await prismaClient.file.update({
            where: {
                path: symlink.path
            },
            data: {
                targetPath: newTargetPath
            }
        });

        logger.info(`Updated symlink ${symlink.path} to point to ${newTargetPath}`);
    }

    return symlinks.length;
}
