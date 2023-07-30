import { protectedProcedure } from "~/server/infrastructure/trpc";
import { z } from "zod";
import type { PersonalTask, Prisma, PrismaClient } from "@prisma/client";
import type { TaskArchived } from "./archived-task";
import type { PersonalTaskId } from "../personal-task";
import { type QueryPersonalTask, queryPersonalTask } from "../read/get-personal-task";
import { validateInputOperation } from "../delete/delete-task";

export const archiveTaskProcedure = protectedProcedure
    .input(z.object({ taskId: z.string().nonempty() }))
    .mutation(({ctx, input}) => archiveTask({
        command: {
            taskId: input.taskId,
            userId: ctx.session.user.id,
        },
        queryPersonalTask: queryPersonalTask(ctx.prisma),
        archiveDbOperation: executeDbTaskArchive(ctx.prisma),
    }));

const archiveTask = async ({ command, queryPersonalTask, archiveDbOperation }: {
    command: { taskId: PersonalTaskId, userId: string }, 
    queryPersonalTask: QueryPersonalTask,
    archiveDbOperation: ExecuteDbTaskDelition,
}) => {
    const fetchedTask = await queryPersonalTask(command.taskId);
    const task = validateInputOperation({task: fetchedTask, userId: command.userId});

    const update: TaskArchived = {
        type: "ARCHIVED",
        taskId: command.taskId,
        on: new Date(),
    };

    await archiveDbOperation(task, update);
}

type ExecuteDbTaskDelition = ReturnType<typeof executeDbTaskArchive>;
const executeDbTaskArchive = (db: PrismaClient) => (task: PersonalTask, update: TaskArchived) => db.$transaction([
    db.personalTask.delete({ where: { id: task.id } }),
    db.archivedPersonalTask.create({
        data: {
            id: task.id,
            title: task.title,
            status: task.status,
            notes: task.notes as Prisma.InputJsonValue[],
            createdOn: task.createdOn,
            userId: task.userId,
            updates: [...task.updates, update] as Prisma.InputJsonValue[],
        }
    }),
]);