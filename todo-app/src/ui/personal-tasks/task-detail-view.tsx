import { api } from "../api";
import { Box, Button, HStack, Radio, RadioGroup, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { type PersonalTaskId, TaskStatus, stringToTaskStatus } from "~/server/personal-tasks/personal-task";
import { usePersonalTasks } from "./state/use-personal-tasks";

export const TaskDetailView = () => {
    const { task, isDataLoading, isDeleting, onDeleteTask, isArchiving, onArchiveTask } = useTaskDetail();

    return (<>
        {isDataLoading ?
            <Spinner /> :
            (!task) ?
                <></> :
                <>
                    <SimpleGrid columns={2}>
                        <Box>title</Box>
                        <Box>{task.title}</Box>
                        
                        <Box>status</Box>
                        <Status statusValue={task.status} taskId={task.id} />

                        <Box>created on</Box>
                        <Box>{task.createdOn.toDateString()}</Box>
                    </SimpleGrid>
                    <HStack paddingTop={'1rem'}>
                        <Box>
                            <Button size={'sm'} onClick={_ => onDeleteTask(task.id)} >{ isDeleting ?
                                <Spinner /> :
                                <Text>delete</Text>
                            }</Button>
                        </Box>
                        <Box>
                        <Button size={'sm'} onClick={_ => onArchiveTask(task.id)} >{ isArchiving ?
                                <Spinner /> :
                                <Text>archive</Text>
                            }</Button>
                        </Box>
                    </HStack>
                </>
        }
    </>);
}

const useTaskDetail = () => {
    const { selectedTask, selectTask } = usePersonalTasks((s) => ({selectedTask: s.selectedTask, selectTask: s.selectTask }));
    const { data, isLoading: isDataLoading } = api.personalTasks.get.useQuery({taskId: selectedTask!}, {enabled: !!selectedTask});
    const { isLoading: isDeleting, mutate: deleteMutation } = api.personalTasks.delete.useMutation();
    const { isLoading: isArchiving, mutate: archiveMutation } = api.personalTasks.archive.store.useMutation();
    const { refetch } = api.personalTasks.getAllList.useQuery();

    const onDeleteTask = (taskId: PersonalTaskId) => deleteMutation({taskId}, {onSuccess: () => {
        selectTask(null);
        refetch().catch(_ => {return;});
    }});

    const onArchiveTask = (taskId: PersonalTaskId) => archiveMutation({taskId}, {onSuccess: () => {
        selectTask(null);
        refetch().catch(_ => {return;});
    }});

    return {
        task: data,
        isDataLoading: isDataLoading && !!selectedTask,
        isDeleting,
        onDeleteTask,
        isArchiving,
        onArchiveTask,
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
    const { mutate: mutateUpdateStatus, isLoading: isLoadingMuation } = api.personalTasks.updateStatus.useMutation();
    const { refetch: refetchAll, isRefetching: isRefetchingAll } = api.personalTasks.getAllList.useQuery();

    const onUpdateStatus = (newStatus: TaskStatus) => mutateUpdateStatus(
        {taskId, newStatus}, 
        { onSuccess: _ => {
            Promise.all([refetchAll(),refetch()])
                .catch(_ => {return;});
        }}
    );

    return {
        isUpdatingSattus: isLoadingMuation || (isRefetching && isRefetchingAll),
        onUpdateStatus
    };
}