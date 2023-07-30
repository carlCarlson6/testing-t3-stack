import type { PersonalTaskId } from "../personal-task";

export interface TaskArchived {
    type: "ARCHIVED";
    taskId: PersonalTaskId;
    on: Date;
}