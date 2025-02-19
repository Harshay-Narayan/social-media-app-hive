-- CreateTable
CREATE TABLE "UserSession" (
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_user_id_key" ON "UserSession"("user_id");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
