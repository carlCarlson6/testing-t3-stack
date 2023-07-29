import { createStore } from "zustand";
import type { PersonalTaskId, PersonalTaskResume, PersonalTasksResume, TaskTitle } from "~/server/personal-tasks/personal-task";
import type { InputChanged } from "../../input-changed";

export interface PersonalTasksProps {
    tasks: PersonalTasksResume;
}

export interface NewTaskInput { value: TaskTitle, isError: boolean };
export type HandleTaskTitleChange = (e: InputChanged) => void;

export interface PersonalTasksState extends PersonalTasksProps {
    add: (task: PersonalTaskResume) => void,
    newTaskInput: NewTaskInput,
    handleTaskTitleChange: HandleTaskTitleChange,
    resetNewTaskInput: () => void
    selectedTask: PersonalTaskId | null,
    selectTask: (id: PersonalTaskId|null) => void,
    handleUpdateTaskStatus: (task: PersonalTaskResume) => void,
}

const DEFAULT_PROPS = {
    tasks: { todoTasks: [], doneTasks: [], wipTasks: [] },
    newTaskInput: { value: "", isError: true },
    selectedTask: null,
}

const isInputError = (input: string) => input.trim().length === 0 || !input.replace(/\s/g, '').length

export const createPersonalTasksStore = (initProps?: Partial<PersonalTasksProps>) => createStore<PersonalTasksState>()((set) => ({
    ...DEFAULT_PROPS, ...initProps,
    add: (task) => set((state) => ({...state, tasks: { ...state.tasks, todoTasks: [...state.tasks.todoTasks, task] }})) ,
    handleTaskTitleChange: (e) => set((state) => ({
        ...state,
        newTaskInput: { value: e.target.value, isError: isInputError(e.target.value) },
    })),
    resetNewTaskInput: () => set((state) => ({
        ...state,
        newTaskInput: DEFAULT_PROPS.newTaskInput,
    })),
    selectTask: (id) => set((state) => ({...state, selectedTask: id})),
    handleUpdateTaskStatus: (_) => set((state) => ({
        ...state
    })),
}))
