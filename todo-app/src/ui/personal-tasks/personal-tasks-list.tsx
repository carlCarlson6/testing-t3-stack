import { List, ListItem, Divider, Box, Button, useDisclosure, Heading } from "@chakra-ui/react";
import { CreateNewTaskModal } from "./create-new-task";
import type { PersonalTaskResume } from "~/server/personal-tasks/personal-task";
import { usePersonalTasks } from "./state/use-personal-tasks";
import { api } from "../api";

export const PersonalTasksList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {tasks} = usePersonalTaskList();
    return (<>
        <Box paddingRight={5}>
            <Button onClick={() => onOpen()}>new task</Button>
            <Divider marginTop={3} marginBottom={4} />
            
            <Heading size={'sm'} >TODO</Heading>
            <TaskList tasks={tasks.todoTasks}/>
            <Divider marginTop={1} marginBottom={4} />

            <Heading size={'sm'} >WIP</Heading>
            <TaskList tasks={tasks.wipTasks}/>
            <Divider marginTop={1} marginBottom={4} />

            <Heading size={'sm'} >DONE</Heading>
            <TaskList tasks={tasks.doneTasks}/>
            <Divider marginTop={1} marginBottom={4} />
        </Box>

        <CreateNewTaskModal isOpen={isOpen} onClose={onClose} />
    </>);
}

const usePersonalTaskList = () => {
    const { tasks: tasksFromStatus } = usePersonalTasks((s) => ({tasks: s.tasks}));
    const { data: fetchedTasks } = api.personalTasks.getAllList.useQuery();
    return {
        tasks: fetchedTasks ?? tasksFromStatus
    }
}

const TaskList = ({tasks}: {tasks: PersonalTaskResume[]}) => {
    const {selectTask} = usePersonalTasks((s) => ({selectTask: s.selectTask}));
    return (<>
        <List margin={1}>
            {tasks.map(task =>
                <ListItem
                    key={task.id} 
                    padding={'0.33rem'}
                    onClick={() => selectTask(task.id)}
                    _hover={{ 
                        bg: "gray.600",
                        cursor: 'pointer',
                        borderRadius: 'xl'
                    }}
                    _active={{ bg: "gray.700", }}
                >
                    {task.title}
                </ListItem>
            )}
        </List>
    </>);
}