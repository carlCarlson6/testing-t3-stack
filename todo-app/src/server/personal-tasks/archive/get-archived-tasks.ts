import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure } from "~/server/infrastructure/trpc";
import { UserId } from "~/server/user-id";

export const getAllArchivedTasksProcedure = protectedProcedure
    .query(({ctx}) => getAllArchived({
        userId: ctx.session.user.id,
        query: queryAllArchivedTasksFromDb(ctx.prisma),    
    }));

const getAllArchived = async ({userId, query}: {
    userId: UserId,
    query: QueryAllArchivedTasksFromDb,
}) => {
    const allAchivedTasks = await query(userId);
    allAchivedTasks.map(archived => {
        const archivedUpdate = archived.updates[-1];
        //
        //z.string().parse<TaskArchived>(archivedUpdate)
    });

    return await query(userId);
}

type QueryAllArchivedTasksFromDb = ReturnType<typeof queryAllArchivedTasksFromDb>;
const queryAllArchivedTasksFromDb = (db: PrismaClient) => (userId: UserId) => db.archivedPersonalTask.findMany({
    where: { userId },
    select: {
        id: true,
        title: true,
        status: true,
        updates: true,
    },
    orderBy: {
        createdOn: 'asc'
    }
});