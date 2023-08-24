import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Events, inngest } from "../infrastructure/inngest";
import { kv } from "@vercel/kv";
import { Order, buildNewOrder } from "./order";

export const orderCreatedSchema = z.object({
    data:       z.object({
        id:         z.string().nonempty().startsWith("order/"),
        createdAt:      z.coerce.date(),
        paymentResume:  z.object({
            paymentId:  z.string().nonempty(),
            items:          z.array(z.object({
                id:             z.string().nonempty(),
                name:           z.string().nonempty(),
                quantity:       z.number().positive(),
                priceInCents:   z.number().positive(),
            }))
        }),
    })
});

export type OrderCreated = z.infer<typeof orderCreatedSchema>;

export const ORDER_CREATED_EVENT_NAME = ((name: keyof Events) => name)("orders/order.created");

export const publishOrderCreatedInngestEvent = (inggest: typeof inngest, db: PrismaClient): (orderCreated: OrderCreated) => Promise<void> => async (orderCreated) => {
    const data = validateInput(orderCreated).data;
    await Promise.allSettled([
        inggest.send({
            name: ORDER_CREATED_EVENT_NAME,
            data: data
        }),
        db.event.create({
            data: {
                id: data.id,
                producedAt: new Date(),
                type: ORDER_CREATED_EVENT_NAME,
                payload: data
            }
        })
    ]);
}

const validateInput = (orderCreated: OrderCreated) => {
    try {
        return orderCreatedSchema.parse(orderCreated);
    }
    catch {
        throw new TRPCError({
            code: "BAD_REQUEST", 
            cause: "invalid format to generate event", 
            message: `paymet has already processed - orderId [${orderCreated.data.paymentResume.paymentId}]`
        });
    }
}

export type PublishOrderCreated = ReturnType<typeof publishOrderCreatedInngestEvent>;

export const orderCreatedIngestHandler = inngest.createFunction(
    { name:  "handle new order created" },
    { event: "orders/order.created" },
    ({ event, step }) => step.run("update cache", async () => {
        console.log("fetch payment data");
        const order = buildNewOrder(event);
        await kv.hset(order.id, order);
        console.log("cache updated");
        return order;
    })
);