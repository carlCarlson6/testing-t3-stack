-- CreateTable
CREATE TABLE "PersonalTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" JSONB[],
    "createdOn" TIMESTAMP(3) NOT NULL,
    "updates" JSONB[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "PersonalTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonalTask" ADD CONSTRAINT "PersonalTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
