import { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "../infrastructure/trpc";
import { PersonalTask } from "./personal-task";

export const getPersonalTasksListProcedure = protectedProcedure
    .query(async ({ctx}) => {
        var maybeTasks = await getAllPersonalTasks(ctx.prisma, ctx.session.user.id);
        return mapToAllPersonalTasksList(maybeTasks);
    });

const getAllPersonalTasks = (db: PrismaClient, userId: string) => 
    db.user
        .findUnique({where: { id: userId }})
        .personalTasks();

const mapToAllPersonalTasksList = (maybeTasks: PersonalTask[] | null) => (maybeTasks ?? []).map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
}));