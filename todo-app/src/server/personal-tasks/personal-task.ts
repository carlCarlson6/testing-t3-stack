import { Prisma } from "@prisma/client";

export type TaskTitle = string;

export const enum TaskStatus {
    TODO    =   "TODO",
    WIP     =   "WIP",
    DONE    =   "DONE"
}

export type PersonalTask = {
    id: PersonalTaskId;
    title: TaskTitle;
    status: string;
    notes: Prisma.JsonValue[];
    createdOn: Date;
    updates: Prisma.JsonValue[];
    userId: string;
};

export type PersonalTaskId = string;

export type PersonalTaskResume = {
    id: string;
    title: string;
    status: string;
}

export type PersonalTasksResume = PersonalTaskResume[];