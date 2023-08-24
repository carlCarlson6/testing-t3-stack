import { serve } from "inngest/next";
import { inngest } from "~/server/infrastructure/inngest";
import { orderCreatedIngestHandler } from "~/server/orders/order-created";

export default serve(inngest, [
    orderCreatedIngestHandler,
]);
