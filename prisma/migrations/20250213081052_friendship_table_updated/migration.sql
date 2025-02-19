-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Comments_post_id_idx" ON "Comments"("post_id");
