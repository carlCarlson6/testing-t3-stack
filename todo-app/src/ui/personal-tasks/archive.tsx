import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { api } from "../api";

export const DisplayArchiveButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (<>
        <Button onClick={onOpen} size={'sm'}>
            archive
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <Archive closeModal={onClose}/>
            </ModalContent>
        </Modal>
    </>);
};

const Archive = ({closeModal}: {closeModal: () => void}) => {
    const { isLoading, data } = api.personalTasks.archive.getAll.useQuery();

    return (<>
        <ModalHeader> archive </ModalHeader>
        <ModalBody>{ isLoading || !data ?
            <Spinner /> :
            (<>
                <TableContainer>
                    <Table variant={'simple'}>
                        <Thead>
                            <Tr>
                                <Th>title</Th>
                                <Th>status</Th>
                                <Th>archived on</Th>
                            </Tr>
                        </Thead>
                        <Tbody>{data.map(task => (<>
                            <Tr>
                                <Td>{task.title}</Td>
                                <Td>{task.status}</Td>
                            </Tr>
                        </>))}</Tbody>
                    </Table>
                </TableContainer>
            </>)
        }</ModalBody>
    </>);
}