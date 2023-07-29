import { api } from "../api";
import { Box, Button, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react";
import { type HandleTaskTitleChange, type NewTaskInput, usePersonalTasks } from "./personal-tasks-state";
import type { TaskTitle } from "~/server/personal-tasks/personal-task";

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
					>create</Button>
				}
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>);
};

interface CreateNewTaskProps { handleOnCreate: HandleOnCreate, newTaskInput: NewTaskInput, handleTaskTitleChange: HandleTaskTitleChange };

const CreateNewTask = ({handleOnCreate, newTaskInput, handleTaskTitleChange}: CreateNewTaskProps) => (<>
	<Box>
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleOnCreate(newTaskInput.value);
			} }
		>
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
	const { addTasks, resetNewTaskInput, newTaskInput, handleTaskTitleChange, } = usePersonalTasks((s) => ({
		addTasks: s.add, 
		handleTaskTitleChange: s.handleTaskTitleChange, 
		newTaskInput: s.newTaskInput, 
		resetNewTaskInput: s.resetNewTaskInput
	}));
	const handleOnCreate = (title: TaskTitle) => mutate({title}, {onSuccess: (response) => {
		addTasks(response);
		resetNewTaskInput();
		closeModal();
	}});

	return {
		handleOnCreate, 
		newTaskInput,
		handleTaskTitleChange,
		isCreating
	}
}
	