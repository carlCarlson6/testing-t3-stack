import { createTRPCRouter, } from "~/server/infrastructure/trpc";
import { createOrderProcedure } from "./create-order";
import { getAllOrdersProcedure } from "./get-orders";

export const ordersRouter = createTRPCRouter({
    create: createOrderProcedure,
    getAll: getAllOrdersProcedure,
});