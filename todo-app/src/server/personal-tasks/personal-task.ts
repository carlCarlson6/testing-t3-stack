import type { Prisma } from "@prisma/client";

export type TaskTitle = string;

export enum TaskStatus {
    TODO = "TODO",
    WIP  = "WIP",
    DONE = "DONE"
}

export const stringToTaskStatus = (str: string) => TaskStatus[str as keyof typeof TaskStatus];

export interface PersonalTask {
    id: PersonalTaskId;
    title: TaskTitle;
    status: string;
    notes: Prisma.JsonValue[];
    createdOn: Date;
    updates: Prisma.JsonValue[];
    userId: string;
};

export type PersonalTaskId = string;

export interface PersonalTaskResume {
    id: string;
    title: string;
    status: string;
}

export interface PersonalTasksResume {
    todoTasks: PersonalTaskResume[],
    wipTasks:  PersonalTaskResume[],
    doneTasks: PersonalTaskResume[],
}