import { Flex, Container, Divider, FormControl, FormLabel, Input, Spacer, Text, Box, Button, Spinner, List, ListItem } from "@chakra-ui/react";
import { useState } from "react";
import { InputChanged } from "../ui/input-changed";
import { api } from "~/ui/api";
import { AuthGuard } from "~/ui/auth-guard";

const _Home = () => {
	const { data } = api.personalTasks.getAllList.useQuery();
	const tasksList = data ?? [];

	return (<>
		<Flex>
			<Box>
				<Text>list of tasks</Text>
				<List>
					{ tasksList.map(task => 
						<ListItem>
							{task.title}
						</ListItem>) 
					}
				</List>
				
			</Box>
			<Box p={5}>
				<CreateNewTask />
			</Box>
		</Flex>
	</>);
}

const Home = () => (
	<AuthGuard>
		<_Home/>
	</AuthGuard>
);

const CreateNewTask = () => {
	const { mutate: createPersonalTask, isLoading } = api.personalTasks.create.useMutation();
	const [taskTitle, setTaskTitle] = useState<{value: string, isError: boolean}>({value: '', isError: true});
	const handleTaskTitleChange = (e: InputChanged) => setTaskTitle({
		value: e.target.value,
		isError: e.target.value.trim().length === 0,
	});

	return (<>
		<Container>
			<Text>create new task</Text> 
			<Divider />
			<form 
				onSubmit={(e) => {
					createPersonalTask({title: taskTitle.value});
				}}
			>
				<FormControl isRequired isInvalid={taskTitle.isError}>
					<FormLabel>
						title
					</FormLabel>
					<Input 
						type={'text'}
						value={taskTitle.value}
						onChange={handleTaskTitleChange}
					/>
				</FormControl>
				{ isLoading  ?
					<Spinner /> :
					<Button type={'submit'}>create</Button>
				}
			</form>	
		</Container>
	</>);
}

export default Home;