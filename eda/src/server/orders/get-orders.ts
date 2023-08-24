import { Prisma, PrismaClient } from "@prisma/client";
import { VercelKV, kv } from "@vercel/kv";
import { Order, buildNewOrder, orderSchema } from "./order";
import { None, Option, Some } from "@sniptt/monads";
import { publicProcedure } from "../infrastructure/trpc";
import { ORDER_CREATED_EVENT_NAME, orderCreatedSchema } from "./order-created";
import { match } from "ts-pattern";

export const getAllOrdersProcedure = publicProcedure.query(async ({ctx}) => await getAllOrdersFromDataSources(ctx.prisma, kv)())

export const getOrderFromDataSources = (db: PrismaClient, kv: VercelKV): (orderId: string) => Promise<Option<Order>> => async (orderId) => 
    await kv.exists(orderId)
        ? await fetchOrderFromCatche(kv, orderId)
        : await buildOrderFromStoredEvents(db, orderId)

const fetchOrderFromCatche = async (kv: VercelKV, orderId: string) => {
    try {
        const orderFromKv = await kv.hgetall<Order>(orderId);
        return !orderFromKv 
            ? None
            : Some(orderSchema.parse(orderFromKv));
    }
    catch(e) {
        console.error("failed", e)
        return None;
    }
}

const buildOrderFromStoredEvents = async (db: PrismaClient, orderId: string): Promise<Option<Order>> => {
    const allEvents = await db.event.findMany({
        where:   { id: orderId },
        orderBy: { producedAt: "asc" },
        select:  { type: true, payload: true }
    });
    if (allEvents.length === 0) return None;

    const order = allEvents.reduce<Order>(
        (current, event) =>
        processStoredEvent(event.type, event.payload, current), {
            id: "",
            status: 'IN_PREPARATION',
            createdAt: new Date(),
            paymentResume: {
                paymentId: "",
                items: [],
            }
        })
        
    return Some(orderSchema.parse(order));
}

// TODO - use proper naming
const processStoredEvent = (eventType: string, payload: Prisma.JsonValue, currentOrderState: Order) => match(eventType)
    .returnType<Order>()
    .with(ORDER_CREATED_EVENT_NAME, _ => buildNewOrder(orderCreatedSchema.parse(payload)))
    .otherwise(unknownEvent => { throw new Error(`unknown event case [${unknownEvent}]`) });


export type GerOrder = ReturnType<typeof getOrderFromDataSources>;


export const getAllOrdersFromDataSources = (db: PrismaClient, kv: VercelKV): () => Promise<Order[]> => async () => {
    const ordersIds = await getAllOrderIds(db);
    const getOrder = getOrderFromDataSources(db, kv);
    const maybeOrders = await Promise.all(ordersIds.map(async orderId => await getOrder(orderId)));
    return maybeOrders.reduce((payload, maybeOrder) => maybeOrder.match({
        some: order => [ ...payload, order ],
        none: payload,
    }), [] as Order[]);
}

export type GetAllOrders = ReturnType<typeof getAllOrdersFromDataSources>;

const getAllOrderIds = async (db: PrismaClient) => {
    const orders = await db.event.findMany({
        where:  { 
            id: { startsWith: 'order/', }, 
            type: ORDER_CREATED_EVENT_NAME
        },
        select: { id: true, }
    })
    return orders.map(o => o.id);
}