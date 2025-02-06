-- CreateTable
CREATE TABLE "Comments" (
    "comment_id" TEXT NOT NULL,
    "comment_text" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "Replies" (
    "reply_id" TEXT NOT NULL,
    "reply_text" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Replies_pkey" PRIMARY KEY ("reply_id")
);

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;
