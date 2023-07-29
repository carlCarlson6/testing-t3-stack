import { api } from "../api";
import { Box, Radio, RadioGroup, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";
import { type PersonalTaskId, TaskStatus, stringToTaskStatus } from "~/server/personal-tasks/personal-task";
import { usePersonalTasks } from "./state/use-personal-tasks";

export const TaskDetailView = () => {
    const {task, isDataLoading} = useTaskDetail();

    return (<>
        {isDataLoading ?
            <Spinner /> :
            (!task) ?
                <>null</> :
                <>
                    <SimpleGrid columns={2}>
                        <Box>title</Box>
                        <Box>{task.title}</Box>
                        
                        <Box>status</Box>
                        <Status statusValue={task.status} taskId={task.id} />

                        <Box>created on</Box>
                        <Box>{task.createdOn.toDateString()}</Box>
                    </SimpleGrid>
                </>
        }
    </>);
}

const useTaskDetail = () => {
    const {selectedTask, } = usePersonalTasks((s) => ({selectedTask: s.selectedTask,}));
    const { data, isLoading: isDataLoading } = api.personalTasks.get.useQuery({taskId: selectedTask!}, {enabled: !!selectedTask});
    return {
        task: data,
        isDataLoading: isDataLoading && !!selectedTask
    }
}

const Status = ({statusValue, taskId}: {statusValue: string, taskId: PersonalTaskId}) => {
    const { isUpdatingSattus, onUpdateStatus } = useSatus(taskId);
    return (<>
        <RadioGroup value={statusValue} onChange={(newValue) => onUpdateStatus(stringToTaskStatus(newValue))} >
            <Stack direction={'row'}> { isUpdatingSattus ?
                <Spinner /> :
                (<>
                    <Radio value={TaskStatus.TODO}>{TaskStatus.TODO}</Radio>
                    <Radio value={TaskStatus.WIP}>{TaskStatus.WIP}</Radio>
                    <Radio value={TaskStatus.DONE}>{TaskStatus.DONE}</Radio>
                </>)
            }</Stack>
        </RadioGroup>
    </>);
}

const useSatus = (taskId: PersonalTaskId) => {
    const { refetch, isRefetching } = api.personalTasks.get.useQuery({taskId});
    const { mutate, isLoading: isLoadingMuation } = api.personalTasks.updateStatus.useMutation();
    const { refetch: refetchAll, isRefetching: isRefetchingAll } = api.personalTasks.getAllList.useQuery();

    const onUpdateStatus = (newStatus: TaskStatus) => mutate(
        {taskId, newStatus}, 
        { onSuccess: _ => {
            Promise.all([refetchAll(),refetch()])
                .catch(_ => {return;});
        }}
    );

    return {
        isUpdatingSattus: isRefetching || isLoadingMuation || isRefetchingAll,
        onUpdateStatus
    };
}