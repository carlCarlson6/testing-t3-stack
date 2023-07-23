import { Prisma } from "@prisma/client";

export type TaskTitle = string;

export const enum TaskStatus {
    TODO    =   "TODO",
    WIP     =   "WIP",
    DONE    =   "DONE"
}

export type PersonalTask = {
    id: string;
    title: TaskTitle;
    status: string;
    notes: Prisma.JsonValue[];
    createdOn: Date;
    updates: Prisma.JsonValue[];
    userId: string;
};
