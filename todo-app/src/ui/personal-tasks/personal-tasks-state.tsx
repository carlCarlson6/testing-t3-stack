import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { PersonalTaskResume, PersonalTasksResume } from "~/server/personal-tasks/get-personal-tasks-list";
import { TaskTitle } from "~/server/personal-tasks/personal-task";
import { InputChanged } from "../input-changed";

interface PersonalTasksProps {
    tasks: PersonalTasksResume;
}

const DEFAULT_PROPS = {
    tasks: [],
    newTaskInput: { value: "", isError: false }
}

interface PersonalTasksState extends PersonalTasksProps {
    newTaskInput: {value: TaskTitle, isError: boolean },
    add: (task: PersonalTaskResume) => void,
    handleTaskTitleChange: (e: InputChanged) => void,
    resetNewTaskInput: () => void
}

type PersonalTasksStore = ReturnType<typeof createPersonalTasksStore>

const createPersonalTasksStore = (initProps?: Partial<PersonalTasksProps>) => createStore<PersonalTasksState>()((set) => ({
    ...DEFAULT_PROPS, ...initProps,
    add: (task) => set((state) => ({...state, tasks: [...state.tasks, task]})) ,
    handleTaskTitleChange: (e) => set((state) => ({
        ...state,
        newTaskInput: { value: e.target.value, isError: e.target.value.trim().length === 0 },
    })),
    resetNewTaskInput: () => set((state) => ({
        ...state,
        newTaskInput: DEFAULT_PROPS.newTaskInput,
    })),
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
    const store = useContext(PersonalTasksContext)
    if (!store) throw new Error('Missing BearContext.Provider in the tree')
    return useStore(store, selector, equalityFn)
  }