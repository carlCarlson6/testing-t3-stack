import { protectedProcedure } from "../../infrastructure/trpc";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus, type TaskTitle } from "../personal-task";
import type { PersonalTask, PrismaClient } from "@prisma/client";

export const createPersonalTaskProcedure = protectedProcedure
    .input(z.object({title: z.string().nonempty()}))
    .mutation(({ctx, input}) => createPersonalTask({
        command: { userId: ctx.session.user.id, taskTitle: input.title },
        store: storePersonalTask(ctx.prisma),
    }));

const createPersonalTask = async ({command, store,}: {
    command: {userId: string, taskTitle: TaskTitle},
    store: StorePersonalTask,
}) => {
    const newPersonalTask = {
        id: uuidv4(),
        title: command.taskTitle,
        status: TaskStatus.TODO,
        notes: [],
        createdOn: new Date(),
        updates: [],
        userId: command.userId
    }
    await store(newPersonalTask);
    return newPersonalTask;
};

type StorePersonalTask = ReturnType<typeof storePersonalTask>
const storePersonalTask = (db: PrismaClient) => async (task: PersonalTask) =>
    await db.personalTask.create({data: {...task, notes: [], updates: []}});