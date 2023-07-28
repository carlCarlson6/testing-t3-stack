import { Text, List, ListItem, Divider, Box, border } from "@chakra-ui/react";
import { usePersonalTasks } from "./personal-tasks-state";

export const PersonalTasksList = () => {
    const tasks = usePersonalTasks((s) => s.tasks);
    return (<>
        <Box
            paddingRight={5}
        >
            <Text>my tasks</Text>
            <Divider marginTop={1} marginBottom={3} />
            <List margin={1}>
                {tasks.map(task => 
                    <Box 
                        padding={1}
                        _hover={{ 
                            bg: "gray.600",
                            cursor: 'pointer',
                            borderRadius: 'xl'
                    }}>
                        <ListItem>
                            {task.title}
                        </ListItem>
                    </Box>) 
                }
            </List>
        </Box>
    </>);
}