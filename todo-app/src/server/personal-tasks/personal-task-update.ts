import type { PersonalTaskId, TaskStatus } from "./personal-task";

export type PersonalTaskUpdate = 
    | StatusUpdate
    | UnknownUpdate

export interface StatusUpdate {
    type: "STATUS_UPDATED";
    taskId: PersonalTaskId
    previus: TaskStatus,
    new: TaskStatus,
    on: Date;
}

export interface DeletedPersonalTaskUpdate {
    type: "DELETED_TASK",
    taskId: PersonalTaskId,
    on: Date,
}

interface UnknownUpdate {
    type: "UNKNOWN_UPDATE"
}