/*
  Warnings:

  - Added the required column `user_avatar_url` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_avatar_url" TEXT NOT NULL;
