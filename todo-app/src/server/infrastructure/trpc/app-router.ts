import { exampleRouter } from "~/server/infrastructure/trpc/example-procedures";
import { createTRPCRouter } from "~/server/infrastructure/trpc";
import { personalTasksRouter } from "~/server/personal-tasks/personal-tasks-router";

export const appRouter = createTRPCRouter({
    example: exampleRouter,
    personalTasks: personalTasksRouter,
});

export type AppRouter = typeof appRouter;
