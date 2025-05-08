import { FileType } from '@prisma/client';
import { prisma } from '@repositories';

export const removeItem = async (removePath: string) => {
    try {
        const parentPath = removePath.split('/').slice(0, -1).join('/');

        const latestItemOfParent = await prisma.file.findMany({
            where: { path: { startsWith: parentPath.concat('/') } },
            orderBy: { createdAt: 'asc' },
            take: 1
        });

        if (latestItemOfParent.length > 0) {
            await prisma.$transaction(async (tx) => {
                await tx.content.deleteMany({
                    where: {
                        OR: [{ path: { startsWith: removePath + '/' } }, { path: removePath }]
                    }
                });
                await tx.file.deleteMany({
                    where: {
                        OR: [{ path: { startsWith: removePath + '/' } }, { path: removePath }]
                    }
                });

                const parentItem = await tx.file.findFirst({
                    where: { OR: [{ path: { startsWith: parentPath + '/' } }, { path: parentPath }] }
                });
                if (!parentItem) {
                    const createEmptyParent = tx.file.create({
                        data: { path: parentPath, type: FileType.DIRECTORY, createdAt: latestItemOfParent[0].createdAt }
                    });
                    await createEmptyParent;
                }
            });
        }
    } catch (error) {
        throw error;
    }
};
