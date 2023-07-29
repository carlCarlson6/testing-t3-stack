import { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "../infrastructure/trpc";
import { PersonalTask, PersonalTasksResume } from "./personal-task";

export const getPersonalTasksListProcedure = protectedProcedure
    .query(({ctx}) => getPersonalTasksList(ctx.prisma, ctx.session.user.id));

export const getPersonalTasksList = async (db: PrismaClient, userId: string): Promise<PersonalTasksResume> => {
    var maybeTasks = await queryAllPersonalTasks(db, userId);
    return mapToAllPersonalTasksList(maybeTasks)
};

const queryAllPersonalTasks = (db: PrismaClient, userId: string) => db.user
    .findUnique({where: { id: userId }})
    .personalTasks();

const mapToAllPersonalTasksList = (maybeTasks: PersonalTask[] | null) => (maybeTasks ?? [])
    .map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
    }));