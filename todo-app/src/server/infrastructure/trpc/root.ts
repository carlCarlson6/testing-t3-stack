import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/infrastructure/trpc/trpc";

export const appRouter = createTRPCRouter({
    example: exampleRouter,
});


export type AppRouter = typeof appRouter;
