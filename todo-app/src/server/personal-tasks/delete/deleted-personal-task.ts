import type { PersonalTaskId } from "../personal-task";

export interface DeletedPersonalTask {
    type: "DELETED_TASK";
    taskId: PersonalTaskId;
    on: Date;
}
