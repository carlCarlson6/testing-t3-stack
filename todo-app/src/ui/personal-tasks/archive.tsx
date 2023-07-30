import { Button, useDisclosure } from "@chakra-ui/react";

export const DisplayArchiveButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (<>
        <Button onClick={onOpen} size={'sm'}>
            archive
        </Button>
    </>);
};

const Archive = () => {

    return (<>
    
    </>);
}