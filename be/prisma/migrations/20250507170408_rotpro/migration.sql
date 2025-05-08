/*
  Warnings:

  - The primary key for the `Content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `path` on the `Content` table. All the data in the column will be lost.
  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `type` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - A unique constraint covering the columns `[path]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_path_fkey`;

-- AlterTable
ALTER TABLE `Content` DROP PRIMARY KEY,
    DROP COLUMN `path`,
    ADD COLUMN `fileId` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `File` DROP PRIMARY KEY,
    ADD COLUMN `content` VARCHAR(191) NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` INTEGER NULL,
    MODIFY `type` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `Content_fileId_idx` ON `Content`(`fileId`);

-- CreateIndex
CREATE UNIQUE INDEX `File_path_key` ON `File`(`path`);

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
