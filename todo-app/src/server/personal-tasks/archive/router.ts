import { createTRPCRouter } from "~/server/infrastructure/trpc";
import { archiveTaskProcedure } from "./archive-task";
import { unarchivedTaskProcedure } from "./unarchive-task";
import { qetAllArchivedTasksProcedure } from "./get-archived-tasks";

export const archiveTasksRouter = createTRPCRouter({
    store: archiveTaskProcedure,
    unStore: unarchivedTaskProcedure,
    getAll: qetAllArchivedTasksProcedure,
});