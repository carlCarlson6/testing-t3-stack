import type { TaskArchived, TaskUnarchived } from "./archive/archived-task";
import type { PersonalTaskDeleted } from "./delete/deleted-personal-task";
import type { StatusUpdated } from "./update-status/status-updated";

export type PersonalTaskUpdates = 
    | StatusUpdated
    | UnknownUpdate
    | PersonalTaskDeleted
    | TaskArchived
    | TaskUnarchived

interface UnknownUpdate {
    type: "UNKNOWN_UPDATE"
}