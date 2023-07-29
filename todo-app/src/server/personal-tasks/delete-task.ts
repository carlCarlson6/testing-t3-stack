import { z } from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import type { PersonalTask, Prisma, PrismaClient } from "@prisma/client";
import { QueryPersonalTask, queryPersonalTask } from "./get-personal-task";
import { TRPCError } from "@trpc/server";
import { DeletedPersonalTaskUpdate } from "./personal-task-update";
import { prisma } from "../infrastructure/db/prisma";

export const deleteTaskProcedure = protectedProcedure
    .input(z.object({ taskId: z.string().nonempty() }))
    .mutation(({ctx, input}) => deleteTask({
        command: { 
            taskId: ctx.session.user.id, 
            userId: input.taskId,
        },
        delitionDbOperation: executeDbTaskDelition(ctx.prisma),
        queryPersonalTask: queryPersonalTask(ctx.prisma),
    }));

const deleteTask = async ({command, delitionDbOperation, queryPersonalTask}: {
    command: { taskId: string, userId: string }, 
    delitionDbOperation: ExecuteDbTaskDelition,
    queryPersonalTask: QueryPersonalTask,
}) => {
    const fetchedTask = await queryPersonalTask(command.taskId);
    const task = validateInputOperation({task: fetchedTask, userId: command.userId});

    const update: DeletedPersonalTaskUpdate = {
        type: "DELETED_TASK",
        taskId: command.taskId,
        on: new Date(),
    };

    await delitionDbOperation(task, update);
}

type ExecuteDbTaskDelition = ReturnType<typeof executeDbTaskDelition>;
const executeDbTaskDelition = (db: PrismaClient) => (task: PersonalTask, update: DeletedPersonalTaskUpdate) => 
    db.$transaction([
        prisma.personalTask.delete({ where: { id: task.id } }),
        prisma.personalTask.create({data: {
            id:        task.id,
            title:     task.title,
            status:    task.status,
            notes:     task.notes as Prisma.InputJsonValue[],
            createdOn: task.createdOn,
            userId:    task.userId,
            updates:   [...task.updates, update] as Prisma.InputJsonValue[],
        }})
    ]);

const validateInputOperation = ({task, userId}: {task: PersonalTask|null|undefined, userId: string}) => {
    if (!task)                          throw new TRPCError({ message: "task-not-found", code: "NOT_FOUND" });
    if (task.userId !== userId) throw new TRPCError({ message: "not-the-owner",  code: "FORBIDDEN"   });
    return task;
}