-- CreateTable
CREATE TABLE "ArchivedPersonalTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" JSONB[],
    "createdOn" TIMESTAMP(3) NOT NULL,
    "updates" JSONB[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "ArchivedPersonalTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArchivedPersonalTask" ADD CONSTRAINT "ArchivedPersonalTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
