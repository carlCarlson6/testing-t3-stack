import type { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "../infrastructure/trpc";
import { stringToTaskStatus, type PersonalTasksResume, TaskStatus } from "./personal-task";

export const getPersonalTasksListProcedure = protectedProcedure
    .query(({ctx}) => getPersonalTasksList(ctx.prisma, ctx.session.user.id));

export const getPersonalTasksList = async (db: PrismaClient, userId: string): Promise<PersonalTasksResume> => {
    const maybeTasks = await queryAllPersonalTasks(db, userId);
    return mapToAllPersonalTasksList(maybeTasks)
};

const queryAllPersonalTasks = (db: PrismaClient, userId: string) => db.personalTask
    .findMany({
        where: { userId },
        select: {
            id: true,
            title: true,
            status: true,
            createdOn: true
        },
        orderBy: {
            createdOn: 'asc'
        }
    });

const mapToAllPersonalTasksList = (maybeTasks: { id: string; title: string; status: string; createdOn: Date;}[]) => {
    const allTasks = (maybeTasks ?? []).map(task => ({
        id: task.id,
        title: task.title,
        status: stringToTaskStatus(task.status),
    }));
    return {
        todoTasks: allTasks.filter(t => t.status === TaskStatus.TODO),
        wipTasks:  allTasks.filter(t => t.status === TaskStatus.WIP),
        doneTasks: allTasks.filter(t => t.status === TaskStatus.DONE),
    }
};