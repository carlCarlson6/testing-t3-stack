import type { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "../infrastructure/trpc";
import { z } from "zod";
import type { PersonalTaskId } from "./personal-task";

export const getPersonalTaskProcedure = protectedProcedure
    .input(z.object({taskId: z.string().nonempty()}))
    .query(({ctx: {prisma}, input: {taskId}}) => 
        queryPersonalTask(prisma)(taskId));

export type QueryPersonalTask = ReturnType<typeof queryPersonalTask>;
export const queryPersonalTask = (db: PrismaClient) =>  async (taskId: PersonalTaskId) => 
    await db.personalTask.findUnique({
        where: { id: taskId },
    });