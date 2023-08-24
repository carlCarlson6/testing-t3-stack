import { z } from "zod"
import { OrderCreated } from "./order-created";

const orderStatusSchema = z.union([
    z.literal("IN_PREPARATION"), 
    z.literal("READY_TO_BE_SENT"),
    z.literal("IN_TRANSPORTATION"),
    z.literal("ON_DELIVER"),
    z.literal("ON_CLIENT"),
]);

export const orderSchema = z.object({
    id:            z.string().nonempty().startsWith("order/"),
    status:        orderStatusSchema,
    createdAt:     z.coerce.date(),
    paymentResume: z.object({
        paymentId:   z.string().nonempty(),
        items:       z.array(z.object({
            name:     z.string().nonempty(),
            quantity: z.number().positive(),
        }))
    }),
    // TODO - some kind of time line
});

export type Order =z.infer<typeof orderSchema>;

export const buildNewOrder = (orderCreated: OrderCreated): Order => ({
    id:             orderCreated.data.id,
    status:         "IN_PREPARATION",
    createdAt:      orderCreated.data.createdAt,
    paymentResume:  {
        paymentId:      orderCreated.data.paymentResume.paymentId,
        items:          orderCreated.data.paymentResume.items.map(item => ({
            name:           item.name,
            quantity:       item.quantity
        })),
    }
})