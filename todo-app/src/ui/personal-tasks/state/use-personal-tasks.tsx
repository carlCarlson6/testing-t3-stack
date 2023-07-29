import { type PropsWithChildren, createContext, useContext, useRef } from "react";
import { type PersonalTasksProps, type PersonalTasksState, createPersonalTasksStore } from "./personal-tasks-state";
import { useStore } from "zustand";

type PersonalTasksStore = ReturnType<typeof createPersonalTasksStore>

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