import { createTRPCRouter } from "../infrastructure/trpc";
import { createPersonalTaskProcedure } from "./create-personal-task";
import { getPersonalTaskProcedure } from "./get-personal-task";
import { getPersonalTasksListProcedure } from "./get-personal-tasks-list";
import { updatePersonalTaskStatusProcedure } from "./update-status";

export const personalTasksRouter = createTRPCRouter({
    create: createPersonalTaskProcedure,
    getAllList: getPersonalTasksListProcedure,
    get: getPersonalTaskProcedure,
    updateStatus: updatePersonalTaskStatusProcedure,
});