import { FileType } from '@prisma/client';
import { prisma } from '@repositories';

export async function checkExistingPath(newPath: string): Promise<string | null> {
    const existingPathResult: { path: string }[] = await prisma.$queryRaw`
        SELECT path
        FROM File
        WHERE (path = ${newPath}) OR
        (path LIKE CONCAT(${newPath}, '/' , '%')) OR
        (type = ${FileType.RAW_FILE} AND ${newPath} LIKE CONCAT(path, '/', '%'))
    `;

    if (existingPathResult.length > 0) {
        const existingPath = newPath.length > existingPathResult[0].path.length ? existingPathResult[0].path : newPath;
        return existingPath;
    }
    return null;
}
