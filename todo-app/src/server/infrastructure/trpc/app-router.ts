import { createTRPCRouter } from "~/server/infrastructure/trpc";
import { personalTasksRouter } from "~/server/personal-tasks/infrastructure/router";

export const appRouter = createTRPCRouter({
    personalTasks: personalTasksRouter,
});

export type AppRouter = typeof appRouter;
