import { StatusUpdated } from "./update-status/status-updated";

export type PersonalTaskUpdates = 
    | StatusUpdated
    | UnknownUpdate

interface UnknownUpdate {
    type: "UNKNOWN_UPDATE"
}