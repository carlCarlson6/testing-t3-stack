import { Text, List, ListItem, Divider, Box, border, HStack, Button, useDisclosure, Modal, ModalOverlay, ModalContent, chakra } from "@chakra-ui/react";
import { usePersonalTasks } from "./personal-tasks-state";
import { CreateNewTaskModal } from "./create-new-task";

export const PersonalTasksList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {tasks, selectTask} = usePersonalTasks((s) => ({tasks: s.tasks, selectTask: s.selectTask}));
    return (<>
        <Box
            paddingRight={5}
        >
            <HStack>
                <Text>my tasks</Text>
                <Button onClick={() => onOpen()} >new task</Button>
            </HStack>
            <Divider marginTop={1} marginBottom={3} />
            <List margin={1}>
                {tasks.map(task =>
                    <ListItem 
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
        </Box>

        <CreateNewTaskModal isOpen={isOpen} onClose={onClose} />
    </>);
}