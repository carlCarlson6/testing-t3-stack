import type { PersonalTaskId } from "../personal-task";

export interface PersonalTaskDeleted {
    type: "DELETED_TASK";
    taskId: PersonalTaskId;
    on: Date;
}
