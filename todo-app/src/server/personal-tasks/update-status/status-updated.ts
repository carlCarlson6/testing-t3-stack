import type { PersonalTaskId, TaskStatus } from "../personal-task";

export interface StatusUpdated {
    type: "STATUS_UPDATED";
    taskId: PersonalTaskId;
    previus: TaskStatus;
    new: TaskStatus;
    on: Date;
}
