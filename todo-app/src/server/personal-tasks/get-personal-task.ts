import { PrismaClient } from "@prisma/client";
import { protectedProcedure } from "../infrastructure/trpc";
import { z } from "zod";
import { PersonalTaskId } from "./personal-task";

export const getPersonalTaskProcedure = protectedProcedure
    .input(z.object({taskId: z.string().nonempty()}))
    .query(({ctx: {prisma}, input: {taskId}}) => 
        queryPersonalTasks(prisma, taskId));

const queryPersonalTasks = async (db: PrismaClient, taskId: PersonalTaskId) => {
    return await db.personalTask.findUnique({
        where : { 
            id: taskId
        }
    })
}