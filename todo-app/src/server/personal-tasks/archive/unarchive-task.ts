import { protectedProcedure } from "~/server/infrastructure/trpc";
import { z } from "zod";
import type { ArchivedPersonalTask, Prisma, PrismaClient } from "@prisma/client";
import type { TaskUnarchived } from "./archived-task";
import type { PersonalTaskId } from "../personal-task";
import { queryPersonalTask, type QueryPersonalTask } from "../read/get-personal-task";
import { validateInputOperation } from "../delete/delete-task";

export const unarchivedTaskProcedure = protectedProcedure
    .input(z.object({ taskId: z.string().nonempty() }))
    .mutation(({ctx, input}) => unarchiveTask({
        command: {
            taskId: input.taskId,
            userId: ctx.session.user.id,
        },
        queryPersonalTask: queryPersonalTask(ctx.prisma),
        unarchiveDbOperation: executeDbTaskUnarchive(ctx.prisma),
    }));

const unarchiveTask = async ({command, queryPersonalTask, unarchiveDbOperation}: {
    command: { taskId: PersonalTaskId, userId: string }, 
    queryPersonalTask: QueryPersonalTask,
    unarchiveDbOperation: ExecuteDbTaskUnarchive,
}) => {
    const fetchedTask = await queryPersonalTask(command.taskId);
    const task = validateInputOperation({task: fetchedTask, userId: command.userId});
    await unarchiveDbOperation(
        task, 
        {
            type: "UNARCHIVED",
            taskId: command.taskId,
            on: new Date(),
        }
    );
};

type ExecuteDbTaskUnarchive = ReturnType<typeof executeDbTaskUnarchive>;
const executeDbTaskUnarchive = (db: PrismaClient) => (task: ArchivedPersonalTask, update: TaskUnarchived) => db.$transaction([
    db.archivedPersonalTask.delete({ where: { id: task.id } }),
    db.personalTask.create({ data: {
        id: task.id,
        title: task.title,
        status: task.status,
        notes: task.notes as Prisma.InputJsonValue[],
        createdOn: task.createdOn,
        userId: task.userId,
        updates: [...task.updates, update] as Prisma.InputJsonValue[],
    }}),
]);