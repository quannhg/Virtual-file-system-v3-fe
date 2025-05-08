import { PrismaClient, FileType } from '@prisma/client';

const prisma = new PrismaClient();

async function generateData() {
    await prisma.file.create({
        data: {
            path: '/example/path/to/raw_file_txt',
            name: 'raw_file_txt', // ✅ thêm name
            type: FileType.RAW_FILE,
            Content: {
                create: {
                    data: 'This is the content of the raw file.'
                }
            }
        }
    });

    await prisma.file.create({
        data: {
            path: '/example/path/to/directory',
            name: 'directory', // ✅ thêm name
            type: FileType.DIRECTORY
        }
    });

    await prisma.file.createMany({
        data: [
            {
                path: '/example/path/to/another_file_txt',
                name: 'another_file_txt', // ✅ thêm name
                type: FileType.RAW_FILE
            },
            {
                path: '/example/path/to/subdirectory',
                name: 'subdirectory', // ✅ thêm name
                type: FileType.DIRECTORY
            }
        ]
    });

    process.exit(0);
}

generateData();
