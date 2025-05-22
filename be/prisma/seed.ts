import { PrismaClient, FileType } from '@prisma/client';

const prisma = new PrismaClient();

async function generateData() {
    // Xóa sạch dữ liệu cũ (nếu cần)
    await prisma.content.deleteMany();
    await prisma.file.deleteMany();

    // Tạo file RAW với content
    await prisma.file.create({
        data: {
            path: '/docs/readme.txt',
            name: 'readme.txt',
            type: FileType.RAW_FILE,
            size: 123,
            content: {
                create: {
                    data: 'This is the readme file content for the docs folder.'
                }
            }
        }
    });

    await prisma.file.create({
        data: {
            path: '/docs/tutorial.md',
            name: 'tutorial.md',
            type: FileType.RAW_FILE,
            size: 456,
            content: {
                create: {
                    data: '# Tutorial\n\nThis is a tutorial markdown file.'
                }
            }
        }
    });

    // Tạo thư mục
    await prisma.file.create({
        data: {
            path: '/docs',
            name: 'docs',
            type: FileType.DIRECTORY
        }
    });

    await prisma.file.create({
        data: {
            path: '/images',
            name: 'images',
            type: FileType.DIRECTORY
        }
    });

    // Tạo các file RAW_FILE không có content (giả sử file lớn hoặc tạm)
    await prisma.file.createMany({
        data: [
            {
                path: '/images/photo1.jpg',
                name: 'photo1.jpg',
                type: FileType.RAW_FILE,
                size: 2048
            },
            {
                path: '/images/photo2.png',
                name: 'photo2.png',
                type: FileType.RAW_FILE,
                size: 1024
            }
        ]
    });

    // Tạo thư mục con
    await prisma.file.create({
        data: {
            path: '/images/events',
            name: 'events',
            type: FileType.DIRECTORY
        }
    });

    // Tạo SYMLINK (biểu tượng liên kết)
    await prisma.file.create({
        data: {
            path: '/shortcut_to_docs',
            name: 'shortcut_to_docs',
            type: FileType.SYMLINK,
            targetPath: '/docs'
        }
    });

    await prisma.file.create({
        data: {
            path: '/shortcut_to_photo1',
            name: 'shortcut_to_photo1',
            type: FileType.SYMLINK,
            targetPath: '/images/photo1.jpg'
        }
    });

    // Tạo thêm nhiều file và thư mục để phong phú hơn
    await prisma.file.createMany({
        data: [
            {
                path: '/logs/log1.txt',
                name: 'log1.txt',
                type: FileType.RAW_FILE,
                size: 300
            },
            {
                path: '/logs',
                name: 'logs',
                type: FileType.DIRECTORY
            },
            {
                path: '/backup',
                name: 'backup',
                type: FileType.DIRECTORY
            },
            {
                path: '/backup/db_backup.sql',
                name: 'db_backup.sql',
                type: FileType.RAW_FILE,
                size: 10240
                // Không tạo content (giả sử file backup lớn)
            }
        ]
    });

    // Tạo file RAW_FILE có content khác
    await prisma.file.create({
        data: {
            path: '/notes/todo.txt',
            name: 'todo.txt',
            type: FileType.RAW_FILE,
            size: 64,
            content: {
                create: {
                    data: '- Buy groceries\n- Finish project\n- Call mom'
                }
            }
        }
    });

    await prisma.file.create({
        data: {
            path: '/notes',
            name: 'notes',
            type: FileType.DIRECTORY
        }
    });

    console.log('🌱 Seed data inserted successfully.');
    process.exit(0);
}

generateData();
