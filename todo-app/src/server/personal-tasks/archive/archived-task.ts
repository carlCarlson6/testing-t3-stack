import { z } from "zod";
import type { PersonalTaskId } from "../personal-task";

const TaskArchivedSchema = z.object({
    type: z.literal("ARCHIVED"),
    taskId: z.string().nonempty(),
    on: z.date()
});

export type TaskArchived = z.infer<typeof TaskArchivedSchema>;

export interface TaskUnarchived {
    type: "UNARCHIVED";
    taskId: PersonalTaskId;
    on: Date;
}