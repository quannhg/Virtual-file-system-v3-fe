-- CreateTable
CREATE TABLE `File` (
    `path` VARCHAR(191) NOT NULL,
    `type` ENUM('RAW_FILE', 'DIRECTORY') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `File_path_idx`(`path`),
    PRIMARY KEY (`path`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `Content` (
    `path` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,

    INDEX `Content_path_idx`(`path`),
    PRIMARY KEY (`path`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_path_fkey` FOREIGN KEY (`path`) REFERENCES `File`(`path`) ON DELETE RESTRICT ON UPDATE CASCADE;
