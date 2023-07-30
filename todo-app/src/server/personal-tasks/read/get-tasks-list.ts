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
export const queryAllTasks = (db: PrismaClient) => (userId: string) => 
    db.personalTask.findMany({
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

type Tasks = Awaited<ReturnType<QueryAllTasks>>;
const mapAllTasksList = (tasks: Tasks): PersonalTasksResume => ({
    todoTasks:      tasks.filter(t => stringToTaskStatus(t.status) === TaskStatus.TODO),
    wipTasks:       tasks.filter(t => stringToTaskStatus(t.status) === TaskStatus.WIP),
    doneTasks:      tasks.filter(t => stringToTaskStatus(t.status) === TaskStatus.DONE),
});
