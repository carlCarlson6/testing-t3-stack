import { Text, Box, Button, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from "@chakra-ui/react";
import type { TaskTitle } from "~/server/personal-tasks/personal-task";
import { api } from "../api";
import { usePersonalTasks } from "./state/use-personal-tasks";
import type { HandleTaskTitleChange, NewTaskInput } from "./state/personal-tasks-state";

export const CreateNewTaskModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
	const { handleOnCreate, newTaskInput, handleTaskTitleChange, isCreating } = useCreateNewTask(onClose);
	return (<>
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent backgroundColor={'gray.700'}>
				<ModalHeader>
					<Heading size={"md"}>
						<Text color={'white'}>create new task</Text>
					</Heading>
				</ModalHeader>
				<ModalBody>
					<CreateNewTask 
						newTaskInput={newTaskInput}
						handleOnCreate={handleOnCreate}
						handleTaskTitleChange={handleTaskTitleChange}
					/>
				</ModalBody>
				<ModalFooter>
				{ isCreating  ?
					<Spinner /> :
					<Button 
						type={'submit'}
						isDisabled={newTaskInput.isError}
						onClick={() => handleOnCreate(newTaskInput.value)}
					>create</Button>
				}
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>);
};

interface CreateNewTaskProps { handleOnCreate: HandleOnCreate, newTaskInput: NewTaskInput, handleTaskTitleChange: HandleTaskTitleChange };

const CreateNewTask = ({newTaskInput, handleTaskTitleChange}: CreateNewTaskProps) => (<>
	<Box>
		<form>
			<FormControl
				isRequired
				isInvalid={newTaskInput.isError}
			>
				<InputGroup>
					<InputLeftAddon><p>title</p></InputLeftAddon>
					<Input
						textColor={'white'}
						type={'text'}
						value={newTaskInput.value}
						onChange={handleTaskTitleChange} />
				</InputGroup>
				{ newTaskInput.isError ?
					<FormErrorMessage>a title is required</FormErrorMessage> : <></>
				}
			</FormControl>
		</form>
	</Box>
</>)

type HandleOnCreate = (title: TaskTitle) => void;

const useCreateNewTask = (closeModal: () => void) => {
	const { mutate, isLoading: isCreating } = api.personalTasks.create.useMutation();
	const { refetch } = api.personalTasks.getAllList.useQuery();
	const { addTasks, resetNewTaskInput, newTaskInput, handleTaskTitleChange, } = usePersonalTasks((s) => ({
		addTasks: s.add, 
		handleTaskTitleChange: s.handleTaskTitleChange, 
		newTaskInput: s.newTaskInput, 
		resetNewTaskInput: s.resetNewTaskInput
	}));
	const handleOnCreate = (title: TaskTitle) => mutate({ title }, {
		onSuccess: (response) => {
			refetch().catch(_ => {return;});
			addTasks(response);
			resetNewTaskInput();
			closeModal();
		}
	});

	return {
		handleOnCreate, 
		newTaskInput,
		handleTaskTitleChange,
		isCreating
	}
}
	