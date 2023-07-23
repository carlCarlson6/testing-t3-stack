import { createTRPCRouter } from "../infrastructure/trpc";
import { createPersonalTaskProcedute } from "./create-personal-task";

export const personalTasksRouter = createTRPCRouter({
    create: createPersonalTaskProcedute,
});