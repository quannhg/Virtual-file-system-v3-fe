import { logger } from '@configs';
import { CreateFileDirectoryBody } from '@dtos/in';
import { CreateFileDirectoryResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { checkExistingPath } from 'src/utils/checkExistingPath';
import { getParentPath, normalizePath, invalidateDirectoryCache, invalidateFileCache, resolveFullPath } from '@utils';
import { PATH_IS_REQUIRED } from '@constants';

export const createFileDirectory: Handler<CreateFileDirectoryResult, { Body: CreateFileDirectoryBody }> = async (req, res) => {
    const { path: rawPath, shouldCreateParent, data } = req.body;

    if (!rawPath) {
        return res.unprocessableEntity(PATH_IS_REQUIRED);
    }

    const normalizeResult = await normalizePath(rawPath, data !== null ? data.length !== 0 : false);
    if (normalizeResult.invalid) {
        return res.badRequest(normalizeResult.message);
    }
    let newPath = normalizeResult.path;

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

        await (data
            ? prisma.file.create({
                  data: {
                      path: newPath,
                      type: FileType.RAW_FILE,
                      Content: {
                          create: {
                              data
                          }
                      }
                  }
              })
            : prisma.file.create({
                  data: {
                      path: newPath,
                      type: FileType.DIRECTORY
                  }
              }));

        // Invalidate cache for the parent directory to ensure ls shows the new file/directory
        const parentPath = getParentPath(newPath);
        await invalidateDirectoryCache(parentPath);

        // If this is a file, also invalidate its content cache (though it's likely not cached yet)
        if (data) {
            await invalidateFileCache(newPath);
        }

        return res.send({ message: `Successfully create ${data ? 'file' : 'directory'}` });
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
