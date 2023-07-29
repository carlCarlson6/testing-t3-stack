-- CreateTable
CREATE TABLE "DeletedPersonalTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" JSONB[],
    "createdOn" TIMESTAMP(3) NOT NULL,
    "updates" JSONB[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeletedPersonalTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeletedPersonalTask" ADD CONSTRAINT "DeletedPersonalTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
