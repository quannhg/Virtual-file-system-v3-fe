import { FileType } from '@prisma/client';
import { prisma } from '@repositories';


// trả về targetPath nếu nó là Symlink
export const resolvePathSymlink = async (currentPath: string): Promise<string> => {
    const file = await prisma.file.findUnique({
        where: { path: currentPath }
    });

    return (file?.type === FileType.SYMLINK ? file.targetPath : currentPath) || currentPath;
};
