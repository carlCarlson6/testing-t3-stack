import { PersonalTaskId } from "../personal-task";

export interface ArchivedTask {
    type: "ARCHIVED";
    taskId: PersonalTaskId;
    on: Date;
}