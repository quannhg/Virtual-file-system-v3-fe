import { logger } from '@configs';
import { DIRECTORY_NOT_FOUND, PATH_IS_REQUIRED } from '@constants';
import { FindFileDirectoryQueryStrings } from '@dtos/in';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { getParentPath, normalizePath } from '@utils';

const extractMatchingPaths = (item: SimpleItem, keyString: string): string[] => {
    const pathParts = item.path.split('/');
    let currentPath = '';
    const matchingPaths = [];
    for (const part of pathParts) {
        currentPath += '/' + part;
        if (part.includes(keyString)) {
            if (item.type === 'RAW_FILE' && currentPath.length === item.path.length + 1) matchingPaths.push(currentPath);
            else matchingPaths.push(currentPath + '/');
        }
    }

    return matchingPaths;
};

export const findDirectoryItems: Handler<string[], { Querystring: FindFileDirectoryQueryStrings }> = async (req, res) => {
    const { keyString, path: rawPath } = req.query;

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
                type: FileType.RAW_FILE
            }
        });
        if (exactFile) {
            return res.status(400).send({ message: 'Path must refer to a directory, not a file' });
        }

        const folderExist = await prisma.file.findFirst({
            where: {
                OR: [{ path: path.slice(0, -1), type: FileType.DIRECTORY }, { path: { startsWith: path } }]
            }
        });
        if (!folderExist) {
            return res.status(400).send({ message: DIRECTORY_NOT_FOUND });
        }

        const matchingItems = await prisma.file.findMany({
            where: {
                path: {
                    startsWith: path,
                    contains: keyString
                }
            },
            select: {
                path: true,
                type: true
            }
        });

        const matchingPaths = new Set<string>();

        matchingItems.forEach((item) => {
            const currentMatchingPaths = extractMatchingPaths(
                { ...item, path: item.path.slice(getParentPath(path).length + 1) },
                keyString
            );
            currentMatchingPaths.forEach((matchingPath) => matchingPaths.add(matchingPath));
        });

        return res.send(Array.from(matchingPaths).sort());
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
