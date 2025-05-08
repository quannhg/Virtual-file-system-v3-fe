import { logger } from '@configs';
import { MoveFileDirectoryBody } from '@dtos/in';
import { SingleMessageResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { normalizePath, getLastSegment } from '@utils';
import { appendPath } from 'src/utils/appendPath';
import { checkExistingPath } from 'src/utils/checkExistingPath';

export const moveFileDirectory: Handler<SingleMessageResult, { Body: MoveFileDirectoryBody }> = async (req, res) => {
    const { oldPath: rawOldPath, destinationPath: rawDestinationPath } = req.body;

    if (!rawOldPath || !rawDestinationPath) {
        return res.unprocessableEntity("Please provide both 'old' and 'destination' path.");
    }

    const oldPathNormalizeResult = await normalizePath(rawOldPath);
    const destinationPathNormalizeResult = await normalizePath(rawDestinationPath);
    if (oldPathNormalizeResult.invalid) {
        return res.badRequest(oldPathNormalizeResult.message);
    }
    if (destinationPathNormalizeResult.invalid) {
        return res.badRequest(destinationPathNormalizeResult.message);
    }

    const oldPath = oldPathNormalizeResult.path;
    const destinationPath = destinationPathNormalizeResult.path;

    try {
        const movedItems = await prisma.file.findMany({
            where: {
                OR: [{ path: { startsWith: oldPath + '/' } }, { path: oldPath }]
            },
            select: {
                path: true,
                type: true
            }
        });
        if (movedItems.length === 0) {
            return res.badRequest('Not found any item at ' + oldPath);
        }

        const firstDestinationItem = await prisma.file.findFirst({
            where: {
                OR: [{ path: { startsWith: destinationPath + '/' } }, { path: destinationPath }]
            }
        });
        if (!firstDestinationItem) return res.badRequest('Not found destination path: ' + destinationPath);

        if (destinationPath.includes(oldPath + '/')) return res.badRequest("Can not move folder to it's sub folder");

        if (firstDestinationItem.path.length === destinationPath.length && firstDestinationItem.type === FileType.RAW_FILE) {
            return res.badRequest('Can not move item to file');
        }

        const newPath = appendPath(destinationPath, getLastSegment(oldPath));

        const existingPath = await checkExistingPath(newPath);
        if (existingPath) {
            return res.badRequest(`File or directory already exists at path: ${existingPath}`);
        }

        const removedLengthOfOldPart = oldPath.length - getLastSegment(oldPath).length - 1;

        const parentPath = oldPath.split('/').slice(0, -1).join('/') + '/';
        const latestItemOfParent = await prisma.file.findMany({
            where: { path: { startsWith: parentPath } },
            orderBy: { createdAt: 'asc' },
            take: 1
        });

        await prisma.$transaction(async (tx) => {
            const moveItemsQueries = movedItems.map(async (item) => {
                const absoluteNewPath = appendPath(destinationPath, item.path.slice(removedLengthOfOldPart, item.path.length));

                await tx.file.update({
                    where: {
                        path: item.path
                    },
                    data: {
                        path: absoluteNewPath
                    }
                });
            });
            await Promise.all(moveItemsQueries);

            const parentItem = await tx.file.findFirst({
                where: { OR: [{ path: { startsWith: parentPath } }, { path: parentPath.slice(0, -1) }] }
            });

            if (!parentItem) {
                const createEmptyParent = tx.file.create({
                    data: { path: parentPath.slice(0, -1), type: FileType.DIRECTORY, createdAt: latestItemOfParent[0].createdAt }
                });
                await createEmptyParent;
            }
        });

        return res.send({ message: `Successfully moved ${oldPath} to ${destinationPath}` });
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
