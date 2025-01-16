/*
  Warnings:

  - You are about to drop the column `lies_count` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "lies_count",
ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0;
