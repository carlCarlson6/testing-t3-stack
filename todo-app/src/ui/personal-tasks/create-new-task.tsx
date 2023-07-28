import { api } from "../api";
import { Button, Container, Divider, FormControl, FormLabel, Input, Spinner, Text } from "@chakra-ui/react";
import { usePersonalTasks } from "./personal-tasks-state";
import { TaskTitle } from "~/server/personal-tasks/personal-task";

export const CreateNewTask = () => {
	const { mutate, isLoading: isCreating } = api.personalTasks.create.useMutation();
	const use = usePersonalTasks((s) => ({addTasks: s.add, handleTaskTitleChange: s.handleTaskTitleChange, newTaskInput: s.newTaskInput, resetNewTaskInput: s.resetNewTaskInput}));
	const handleOnCreate = (title: TaskTitle) => mutate(
			{ title },
			{ onSuccess: (response) => {
				use.addTasks(response);
				use.resetNewTaskInput();
			}}
		);
		
	return (<>
		<Container>
			<Text>create new task</Text> 
			<Divider />
			<form 
				onSubmit={(e) => {
					e.preventDefault();
					handleOnCreate(use.newTaskInput.value)
				}}
			>
				<FormControl isRequired isInvalid={use.newTaskInput.isError}>
					<FormLabel>
						title
					</FormLabel>
					<Input 
						type={'text'}
						value={use.newTaskInput.value}
						onChange={use.handleTaskTitleChange}
					/>
				</FormControl>
				{ isCreating  ?
					<Spinner /> :
					<Button type={'submit'}>create</Button>
				}
			</form>	
		</Container>
	</>);
}