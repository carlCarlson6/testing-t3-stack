import type { TaskArchived } from "./archive/archived-task";
import type { PersonalTaskDeleted } from "./delete/deleted-personal-task";
import type { StatusUpdated } from "./update-status/status-updated";

export type PersonalTaskUpdates = 
    | StatusUpdated
    | UnknownUpdate
    | PersonalTaskDeleted
    | TaskArchived

interface UnknownUpdate {
    type: "UNKNOWN_UPDATE"
}