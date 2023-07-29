import { type PropsWithChildren, createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import type { PersonalTaskId, PersonalTaskResume, PersonalTasksResume, TaskTitle } from "~/server/personal-tasks/personal-task";
import type { InputChanged } from "../input-changed";

interface PersonalTasksProps {
    tasks: PersonalTasksResume;
}

export interface NewTaskInput { value: TaskTitle, isError: boolean };
export type HandleTaskTitleChange = (e: InputChanged) => void;

interface PersonalTasksState extends PersonalTasksProps {
    add: (task: PersonalTaskResume) => void,
    newTaskInput: NewTaskInput,
    handleTaskTitleChange: HandleTaskTitleChange,
    resetNewTaskInput: () => void
    selectedTask: PersonalTaskId | null,
    selectTask: (id: PersonalTaskId) => void,
}

const DEFAULT_PROPS = {
    tasks: [],
    newTaskInput: { value: "", isError: false },
    selectedTask: null,
}

type PersonalTasksStore = ReturnType<typeof createPersonalTasksStore>

const isInputError = (input: string) => input.trim().length === 0 || !input.replace(/\s/g, '').length

const createPersonalTasksStore = (initProps?: Partial<PersonalTasksProps>) => createStore<PersonalTasksState>()((set) => ({
    ...DEFAULT_PROPS, ...initProps,
    add: (task) => set((state) => ({...state, tasks: [...state.tasks, task]})) ,
    handleTaskTitleChange: (e) => set((state) => ({
        ...state,
        newTaskInput: { value: e.target.value, isError: isInputError(e.target.value) },
    })),
    resetNewTaskInput: () => set((state) => ({
        ...state,
        newTaskInput: DEFAULT_PROPS.newTaskInput,
    })),
    selectTask: (id) => set((state) => ({...state, selectedTask: id})),
}))

const PersonalTasksContext = createContext<PersonalTasksStore | null>(null);

type PersonalTasksProviderProps = PropsWithChildren<PersonalTasksProps>

export const PersonalTasksProvider = ({children, ...props}: PersonalTasksProviderProps) => {
    const storeRef = useRef<PersonalTasksStore>();
    if(!storeRef.current) storeRef.current = createPersonalTasksStore(props);
    return (
        <PersonalTasksContext.Provider value={storeRef.current}>
            {children}
        </PersonalTasksContext.Provider>
    );
}

export function usePersonalTasks<T>(
    selector: (state: PersonalTasksState) => T,
    equalityFn?: (left: T, right: T) => boolean
): T {
    const store = useContext(PersonalTasksContext);
    if (!store) throw new Error('Missing PersonalTasksContext.Provider in the tree');
    return useStore(store, selector, equalityFn);
}