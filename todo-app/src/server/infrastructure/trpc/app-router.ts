import { exampleRouter } from "~/server/api/example";
import { createTRPCRouter } from "~/server/infrastructure/trpc";

export const appRouter = createTRPCRouter({
    example: exampleRouter,
});

export type AppRouter = typeof appRouter;
