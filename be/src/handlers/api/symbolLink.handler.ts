import { logger } from '@configs';
import { PATH_IS_REQUIRED } from '@constants';
import { SymbolLinkBody } from '@dtos/in';
import { SymbolLinkResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { getParentPath, invalidateDirectoryCache, normalizePath } from '@utils';
import { checkExistingPath } from 'src/utils/checkExistingPath';

export const createSymLinkItems: Handler<SymbolLinkResult, { Body: SymbolLinkBody }> = async (req, res) => {
    const { path: rawPath, shouldCreateParent, targetPath } = req.body;

    if (!rawPath) {
        return res.unprocessableEntity(PATH_IS_REQUIRED);
    }

    const normalizeResult = await normalizePath(rawPath, false);
    if (normalizeResult.invalid) {
        return res.badRequest(normalizeResult.message);
    }
    const newPath = normalizeResult.path;

    try {
        if (!shouldCreateParent) {
            const parentPath = getParentPath(newPath);
            const parentItem = await prisma.file.findFirst({
                where: { OR: [{ path: parentPath, type: FileType.DIRECTORY }, { path: { startsWith: parentPath + '/' } }] }
            });

            if (!parentItem) return res.badRequest(`The specified parent item with path "${parentPath}" does not exist.`);
        }

        const existingPath = await checkExistingPath(newPath);
        if (existingPath) {
            return res.badRequest(`File or directory already exists at path: ${existingPath}`);
        }

        await prisma.file.create({
            data: {
                path: newPath,
                type: FileType.SYMLINK,
                targetPath: targetPath
            }
        });

        // Invalidate cache for the parent directory to ensure ls shows the new file/directory
        const parentPath = getParentPath(newPath);
        await invalidateDirectoryCache(parentPath);

        return res.send({ message: `Successfully create symbol Link` });
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
