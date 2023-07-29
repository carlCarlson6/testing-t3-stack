import { api } from "../api";
import { usePersonalTasks } from "./personal-tasks-state";
import { Box, SimpleGrid, Spinner } from "@chakra-ui/react";

const useTaskDetail = () => {
    const selectedTask = usePersonalTasks((s) => s.selectedTask);
    const { data, isLoading } = api.personalTasks.get.useQuery({taskId: selectedTask!}, {enabled: !!selectedTask});
    return {
        task: data,
        isLoading: isLoading && !!selectedTask
    }
}

export const TaskDetailView = () => {
    const {task, isLoading} = useTaskDetail();

    return (<>
        {isLoading ?
            <Spinner /> :
            (!task) ?
                <>null</> :
                <>
                    <SimpleGrid columns={2}>
                        <Box>title</Box>
                        <Box>{task.title}</Box>
                        
                        <Box>status</Box>
                        <Box>{task.status}</Box>

                        <Box>created on</Box>
                        <Box>{task.createdOn.toDateString()}</Box>
                    </SimpleGrid>
                </>
        }
    </>);
}