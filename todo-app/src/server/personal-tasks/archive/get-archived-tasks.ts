import type { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "~/server/infrastructure/trpc";

export const qetAllArchivedTasksProcedure = protectedProcedure
    .query(({ctx}) => queryAllArchivedTasks(ctx.prisma)(ctx.session.user.id));

const queryAllArchivedTasks = (db: PrismaClient) => (userId: string) => db.archivedPersonalTask.findMany({
    where: { userId },
    select: {
        id: true,
        title: true,
        status: true,
    },
    orderBy: {
        createdOn: 'asc'
    }
});