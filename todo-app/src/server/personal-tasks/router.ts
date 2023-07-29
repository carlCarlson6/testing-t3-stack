import { createTRPCRouter } from "../infrastructure/trpc";
import { createPersonalTaskProcedure } from "./create-personal-task";
import { deleteTaskProcedure } from "./delete-task";
import { getPersonalTaskProcedure } from "./get-personal-task";
import { getPersonalTasksListProcedure } from "./get-personal-tasks-list";
import { updatePersonalTaskStatusProcedure } from "./update-status";

export const personalTasksRouter = createTRPCRouter({
    getAllList: getPersonalTasksListProcedure,
    get: getPersonalTaskProcedure, 
    create: createPersonalTaskProcedure,
    updateStatus: updatePersonalTaskStatusProcedure,
    delete: deleteTaskProcedure,
});