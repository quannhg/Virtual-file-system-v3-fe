/*
  Warnings:

  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` INTEGER NULL;
