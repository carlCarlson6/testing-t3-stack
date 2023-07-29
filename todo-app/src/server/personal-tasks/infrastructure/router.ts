import { createTRPCRouter } from "../../infrastructure/trpc";
import { createPersonalTaskProcedure } from "../create/create-personal-task";
import { deleteTaskProcedure } from "../delete/delete-task";
import { getPersonalTaskProcedure } from "../read/get-personal-task";
import { getPersonalTasksListProcedure } from "../read/get-personal-tasks-list";
import { updatePersonalTaskStatusProcedure } from "../update-status/update-status";

export const personalTasksRouter = createTRPCRouter({
    getAllList: getPersonalTasksListProcedure,
    get: getPersonalTaskProcedure, 
    create: createPersonalTaskProcedure,
    updateStatus: updatePersonalTaskStatusProcedure,
    delete: deleteTaskProcedure,
});