import { protectedProcedure } from "../infrastructure/trpc";
import { z } from "zod";
import { type PersonalTaskId, TaskStatus, stringToTaskStatus } from "./personal-task";
import type { StatusUpdate } from "./personal-task-update";
import type { PersonalTask, Prisma, PrismaClient } from "@prisma/client";
import { queryPersonalTask } from "./get-personal-task";
import { TRPCError } from "@trpc/server";

const updatePersonalTaskStatusInput = z.object({
    taskId: z.string().nonempty(),
    newStatus: z.enum([TaskStatus.TODO, TaskStatus.WIP, TaskStatus.DONE])
});

export const updatePersonalTaskStatusProcedure = protectedProcedure
    .input(updatePersonalTaskStatusInput)
    .mutation(({ctx, input}) => updatePersonalTaskStatus({
        db: ctx.prisma, 
        command: { 
            userId: ctx.session.user.id, 
            taskId: input.taskId, 
            newStatus: input.newStatus }
    }));

const updatePersonalTaskStatus = async ({db, command}: {db: PrismaClient, command: {userId: string, taskId: PersonalTaskId, newStatus: TaskStatus}}) => {
    const fetchedTask = await queryPersonalTask(db, command.taskId);
    const validatedTask = validateInput({
        task: fetchedTask,
        input: {userId: command.userId, newStatus: command.newStatus}
    });
    
    const update: StatusUpdate = {
        type: "STATUS_UPDATED",
        taskId: validatedTask.id,
        previus: stringToTaskStatus(validatedTask.status),
        new: command.newStatus,
        on: new Date(),
    };
    
    return await storePersonalTaskStatusUpdate(db, update, validatedTask.notes);
}

const validateInput = ({task, input}: {task: PersonalTask|null|undefined, input: {userId: string, newStatus: TaskStatus}}) => {
    if (!task)                        throw new TRPCError({ message: "task-not-found", code: "NOT_FOUND"   });
    if (task.userId !== input.userId) throw new TRPCError({ message: "not-the-owner",  code: "FORBIDDEN"   });
    const previousStaus = stringToTaskStatus(task.status);
    if (previousStaus === input.newStatus) throw new TRPCError({ message: "same-status",    code: "BAD_REQUEST" });
    return task;
}

const storePersonalTaskStatusUpdate = async (db: PrismaClient, update: StatusUpdate, previousUpdates: Prisma.JsonValue[]) => 
    await db.personalTask.update({
    where: { id: update.taskId },
    data: {
        status: update.new,
        updates: [...previousUpdates, update] as Prisma.InputJsonValue[]
    }
});