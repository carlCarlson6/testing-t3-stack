import type { PersonalTaskId } from "../personal-task";

export interface TaskArchived {
    type: "ARCHIVED";
    taskId: PersonalTaskId;
    on: Date;
}

export interface TaskUnarchived {
    type: "UNARCHIVED";
    taskId: PersonalTaskId;
    on: Date;
}