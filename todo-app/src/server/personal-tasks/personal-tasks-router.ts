import { createTRPCRouter } from "../infrastructure/trpc";
import { createPersonalTaskProcedute } from "./create-personal-task";
import { getPersonalTasksListProcedure } from "./get-personal-tasks-list";

export const personalTasksRouter = createTRPCRouter({
    create: createPersonalTaskProcedute,
    getAllList: getPersonalTasksListProcedure
});