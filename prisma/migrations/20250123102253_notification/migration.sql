-- CreateEnum
CREATE TYPE "NotificationsTypes" AS ENUM ('LIKE', 'COMMENT', 'FRIENDREQUEST');

-- CreateTable
CREATE TABLE "Notifications" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "friendshi_id" TEXT,
    "is_read" BOOLEAN NOT NULL,
    "type" "NotificationsTypes" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE INDEX "Notifications_user_id_idx" ON "Notifications"("user_id");

-- CreateIndex
CREATE INDEX "Post_post_id_user_id_idx" ON "Post"("post_id", "user_id");
