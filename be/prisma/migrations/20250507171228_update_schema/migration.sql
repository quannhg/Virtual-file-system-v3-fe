/*
  Warnings:

  - The primary key for the `Content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileId` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Content` table. All the data in the column will be lost.
  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `File` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `File` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `path` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_fileId_fkey`;

-- DropIndex
DROP INDEX `File_path_key` ON `File`;

-- AlterTable
ALTER TABLE `Content` DROP PRIMARY KEY,
    DROP COLUMN `fileId`,
    DROP COLUMN `id`,
    ADD COLUMN `path` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`path`);

-- AlterTable
ALTER TABLE `File` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `id`,
    MODIFY `type` ENUM('RAW_FILE', 'DIRECTORY') NOT NULL,
    ADD PRIMARY KEY (`path`);

-- CreateIndex
CREATE INDEX `Content_path_idx` ON `Content`(`path`);

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_path_fkey` FOREIGN KEY (`path`) REFERENCES `File`(`path`) ON DELETE RESTRICT ON UPDATE CASCADE;
