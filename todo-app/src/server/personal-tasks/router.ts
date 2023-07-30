import { createTRPCRouter } from "../infrastructure/trpc";
import { archiveTasksRouter } from "./archive/router";
import { createPersonalTaskProcedure } from "./create-personal-task";
import { deleteTaskProcedure } from "./delete/delete-task";
import { getPersonalTaskProcedure } from "./read/get-personal-task";
import { getAllTasksListProcedure } from "./read/get-tasks-list";
import { updatePersonalTaskStatusProcedure } from "./update-status/update-status";

export const personalTasksRouter = createTRPCRouter({
    getAllList: getAllTasksListProcedure,
    get: getPersonalTaskProcedure, 
    create: createPersonalTaskProcedure,
    updateStatus: updatePersonalTaskStatusProcedure,
    delete: deleteTaskProcedure,
    archive: archiveTasksRouter
});