import type { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "../../infrastructure/trpc";
import type { UserId } from "~/server/user-id";
import { stringToTaskStatus, type PersonalTasksResume, TaskStatus } from "../personal-task";

export const getAllTasksListProcedure = protectedProcedure
    .query(({ctx}) => getAllTasksList({
        userId: ctx.session.user.id,
        queryAll: queryAllTasks(ctx.prisma),
    }));

export const getAllTasksList = async ({userId, queryAll}: {
    userId: UserId,
    queryAll: QueryAllTasks
}) => {
    const allTasks = await queryAll(userId);
    return mapAllTasksList(allTasks)
};

type QueryAllTasks = ReturnType<typeof queryAllTasks>;
export const queryAllTasks = (db: PrismaClient) => async (userId: string) => {
    const [personal, archived] = await db.$transaction([
        queryAllPersonalTasks(db, userId),
        queryAllArchiveTasks(db, userId),
    ]);
    return { personal, archived };
};

const queryAllPersonalTasks = (db: PrismaClient, userId: string) => db.personalTask.findMany({
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

const queryAllArchiveTasks = (db: PrismaClient, userId: string) => db.archivedPersonalTask.findMany({
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

const mapAllTasksList = (tasks: Awaited<ReturnType<QueryAllTasks>>): PersonalTasksResume => ({
    todoTasks:      tasks.personal.filter(t => stringToTaskStatus(t.status) === TaskStatus.TODO),
    wipTasks:       tasks.personal.filter(t => stringToTaskStatus(t.status) === TaskStatus.WIP),
    doneTasks:      tasks.personal.filter(t => stringToTaskStatus(t.status) === TaskStatus.DONE),
    archivedTasks:  tasks.archived,
});

