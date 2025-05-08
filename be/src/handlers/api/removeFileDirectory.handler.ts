import { logger } from '@configs';
import { RemoveFileDirectory } from '@dtos/in';
import { SingleMessageResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { removeItem, getLastSegment, normalizePath } from '@utils';

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
                }
            });
            if (!firstRemoveItem) {
                errorMessages.push(`Cannot remove ${getLastSegment(rawPath)}: File/directory not found`);
                continue;
            }

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
