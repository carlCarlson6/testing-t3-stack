import { exampleRouter } from "~/server/infrastructure/trpc/example";
import { createTRPCRouter } from "~/server/infrastructure/trpc";
import { ordersRouter } from "~/server/orders/orders-router";

export const appRouter = createTRPCRouter({
	example: exampleRouter,
	orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
