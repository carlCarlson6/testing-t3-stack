import { prisma } from "../infrastructure/db/prisma";
import { protectedProcedure } from "../infrastructure/trpc";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

export const createPersonalTaskProcedute = protectedProcedure
    .input(z.object({title: z.string().nonempty()}))
    .mutation(({ctx, input}) => {
        console.log(ctx);
        return createPersonalTask({ userId: ctx.session.user.id, taskTitle: input.title });
    });

type TaskTitle = string;

type TaskStatus = "TODO" | "WIP" | "DONE";

const createPersonalTask = async (command: {userId: string, taskTitle: TaskTitle}) => {
    const newPersonalTask = {
        id: uuidv4(),
        title: command.taskTitle,
        status: "TODO",
        notes: [],
        createdOn: new Date(),
        updates: [],
        userId: command.userId
    }
    await prisma.personalTask.create({data: {...newPersonalTask}});
    return newPersonalTask;
};