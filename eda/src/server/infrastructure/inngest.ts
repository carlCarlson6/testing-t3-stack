import { EventSchemas, Inngest } from "inngest";
import { OrderCreated } from "../orders/order-created";

export type Events = {
    'orders/order.created': OrderCreated,
};

export const inngest = new Inngest({ name: "eda", schemas: new EventSchemas().fromRecord<Events>()});