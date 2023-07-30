import { createTRPCRouter } from "~/server/infrastructure/trpc";
import { archiveTaskProcedure } from "./archive-task";
import { unarchivedTaskProcedure } from "./unarchive-task";

export const archiveTasksRouter = createTRPCRouter({
    store: archiveTaskProcedure,
    unStore: unarchivedTaskProcedure,
});