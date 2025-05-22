// grepFile.handler.ts
import { logger } from '@configs';
import { DIRECTORY_NOT_FOUND } from '@constants';
import { GrepFileQueryStrings } from '@dtos/in';
import { Handler } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { normalizePath } from '@utils';
import mysql from 'mysql2';

export const grepFiles: Handler<
    { path: string; content: string }[],
    { Querystring: GrepFileQueryStrings & { recursive?: string } }
> = async (req, res) => {
    const { contentSearch, path: rawPath = '/', recursive = 'true' } = req.query;
    const isRecursive = recursive === 'true';

    if (!contentSearch?.trim()) {
        return res.status(400).send({ message: 'Content search string is required' });
    }

    const normalizeResult = await normalizePath(rawPath);
    if (normalizeResult.invalid) {
        return res.status(400).send({ message: 'Invalid path' });
    }

    const pathPrefix = normalizeResult.path.endsWith('/') ? normalizeResult.path : `${normalizeResult.path}/`;

    try {
        // Kiểm tra thư mục có tồn tại không
        const folderExists = await prisma.file.findFirst({
            where: {
                OR: [{ path: pathPrefix.slice(0, -1), type: FileType.DIRECTORY }, { path: { startsWith: pathPrefix } }]
            }
        });

        if (!folderExists) {
            return res.status(400).send({ message: DIRECTORY_NOT_FOUND });
        }

        // Escape giá trị đầu vào để tránh SQL injection
        const safePathPrefix = mysql.escape(`${pathPrefix}%`);
        const safeContent = mysql.escape(`%${contentSearch}%`);
        const subpathStart = pathPrefix.length + 1;

        // Truy vấn con phụ thuộc vào chế độ recursive
        const subquery = isRecursive
            ? `SELECT f.path FROM File f WHERE f.type = 'RAW_FILE' AND f.path LIKE ${safePathPrefix}`
            : `SELECT f.path FROM File f
         WHERE f.type = 'RAW_FILE'
           AND f.path LIKE ${safePathPrefix}
           AND LENGTH(REPLACE(SUBSTRING(f.path, ${subpathStart}), '/', '')) = LENGTH(SUBSTRING(f.path, ${subpathStart}))`;

        const fullQuery = `
      SELECT c.path, c.data
      FROM Content c
      WHERE c.path IN (${subquery})
        AND c.data LIKE ${safeContent}
    `;

        const results: { path: string; data: string }[] = await prisma.$queryRawUnsafe(fullQuery);

        const response = results.map((row) => ({
            path: row.path,
            content: row.data
        }));

        return res.status(200).send(response);
    } catch (err) {
        logger.error('Error in grepFiles:', {
            error: err,
            query: { path: rawPath, contentSearch, recursive }
        });
        return res.status(500).send({ message: 'Internal server error' });
    }
};
