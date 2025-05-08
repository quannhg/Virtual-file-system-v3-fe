import { logger } from '@configs';
import { FILE_NOT_FOUND, PATH_IS_REQUIRED } from '@constants';
import { PathQueryStrings } from '@dtos/in';
import { ShowFileContentResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { normalizePath } from '@utils';

export const showFileContent: Handler<ShowFileContentResult, { Querystring: PathQueryStrings }> = async (req, res) => {
    const rawPath = req.query.path;

    if (!rawPath) {
        return res.unprocessableEntity(PATH_IS_REQUIRED);
    }

    const normalizeResult = await normalizePath(rawPath, true);
    if (normalizeResult.invalid) {
        return res.badRequest(normalizeResult.message);
    }
    const path = normalizeResult.path;

    try {
        const file = await prisma.content.findFirst({
            where: {
                path
            },
            select: {
                data: true
            }
        });

        if (file) {
            return res.status(200).send(file);
        } else {
            return res.status(400).send({ message: FILE_NOT_FOUND });
        }
    } catch (err) {
        logger.error(err);
        return res.internalServerError();
    }
};
