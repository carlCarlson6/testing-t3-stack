import { createTRPCRouter } from "~/server/infrastructure/trpc";
import { personalTasksRouter } from "~/server/personal-tasks/personal-tasks-router";

export const appRouter = createTRPCRouter({
    personalTasks: personalTasksRouter,
});

export type AppRouter = typeof appRouter;
