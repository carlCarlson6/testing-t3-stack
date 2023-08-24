import { publicProcedure } from "../infrastructure/trpc";
import { z } from "zod";
import { inngest } from "../infrastructure/inngest";
import { PublishOrderCreated, publishOrderCreatedInngestEvent } from "./order-created";
import { v4 as uuidv4 } from 'uuid';

const createOrderInputSchema = z.object({
    items: z.array(z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty(),
        quantity: z.number().positive(),
        priceInCents: z.number().positive(),
    })),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const createOrderProcedure = publicProcedure
    .input(createOrderInputSchema)
    .mutation(({ctx: { prisma }, input}) => createOrder(
        input, 
        publishOrderCreatedInngestEvent(inngest, prisma)
    ));

const createOrder = async (
    input: CreateOrderInput, 
    publish: PublishOrderCreated,
) => {
    const orderCreated = {
        data: {
            id: `order/${uuidv4()}`,
            createdAt: new Date(),
            paymentResume: {
                paymentId: `payment/${uuidv4()}`,
                ...input,
            }
        }
    };
    console.log("publishing order created")
    await publish(orderCreated);
    console.log("event published")
    return { orderId: orderCreated.data.id };
};

