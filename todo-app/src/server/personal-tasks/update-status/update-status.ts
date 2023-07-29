import { protectedProcedure } from "../../infrastructure/trpc";
import { z } from "zod";
import { type PersonalTaskId, TaskStatus, stringToTaskStatus } from "../personal-task";
import type { PersonalTask, Prisma, PrismaClient } from "@prisma/client";
import { type QueryPersonalTask, queryPersonalTask } from "../read/get-personal-task";
import { TRPCError } from "@trpc/server";
import { StatusUpdated } from "./status-updated";

const updatePersonalTaskStatusInput = z.object({
    taskId: z.string().nonempty(),
    newStatus: z.enum([TaskStatus.TODO, TaskStatus.WIP, TaskStatus.DONE])
});

export const updatePersonalTaskStatusProcedure = protectedProcedure
    .input(updatePersonalTaskStatusInput)
    .mutation(({ctx, input}) => updatePersonalTaskStatus({
        command: { 
            userId: ctx.session.user.id, 
            taskId: input.taskId, 
            newStatus: input.newStatus,
        },
        query: queryPersonalTask(ctx.prisma),
        storeStatusUpdate: storePersonalTaskStatusUpdate(ctx.prisma),
    }));

const updatePersonalTaskStatus = async ({query, command, storeStatusUpdate}: {
    command: { userId: string, taskId: PersonalTaskId, newStatus: TaskStatus },
    query: QueryPersonalTask, 
    storeStatusUpdate: StorePersonalTaskStatusUpdate,
}) => {
    const fetchedTask = await query(command.taskId);

    const validatedTask = validateInput({
        task: fetchedTask,
        input: {userId: command.userId, newStatus: command.newStatus}
    });
    
    const update: StatusUpdated = {
        type: "STATUS_UPDATED",
        taskId: validatedTask.id,
        previus: stringToTaskStatus(validatedTask.status),
        new: command.newStatus,
        on: new Date(),
    };

    return await storeStatusUpdate(update, validatedTask.updates);
}

const validateInput = ({task, input}: {task: PersonalTask|null|undefined, input: {userId: string, newStatus: TaskStatus}}) => {
    if (!task)                        throw new TRPCError({ message: "task-not-found", code: "NOT_FOUND"   });
    if (task.userId !== input.userId) throw new TRPCError({ message: "not-the-owner",  code: "FORBIDDEN"   });
    const previousStaus = stringToTaskStatus(task.status);
    if (previousStaus === input.newStatus) throw new TRPCError({ message: "same-status",    code: "BAD_REQUEST" });
    return task;
}

type StorePersonalTaskStatusUpdate = ReturnType<typeof storePersonalTaskStatusUpdate>;
const storePersonalTaskStatusUpdate = (db: PrismaClient) => async (update: StatusUpdated, previousUpdates: Prisma.JsonValue[]) => 
    await db.personalTask.update({
        where: { id: update.taskId },
        data: {
            status: update.new,
            updates: [...previousUpdates, update] as Prisma.InputJsonValue[]
        }
    });