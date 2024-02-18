import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { api } from "./api";
import { useState } from "react";
import { CreateOrderInput } from "~/server/orders/create-order";
import { useOrders } from "~/server/orders/use-orders";

const mockItemsData = [
    {
        id: "id-product-001",
        name: "some-product-001",
        quantity: 666,
        priceInCents: 115
    }, 
    {
        id: "id-product-002",
        name: "some-product-002",
        quantity: 999,
        priceInCents: 50
    }
];

export const CreateOrderForm = () => {
    const [ orderItems, setOrderItems ] = useState<CreateOrderInput["items"]>(mockItemsData);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutate, isLoading } = api.orders.create.useMutation();
    const { addOrder } = useOrders([]);

    return (<>
        <p>create order </p>

        <form
            onSubmit={e => {
                e.preventDefault();
                addOrder(orderItems);
            }}
        >
            <SimpleGrid column={3}>
                {orderItems.map(orderItem => (
                    <Box border={"2px"} key={orderItem.id}>
                        <p>product: {orderItem.name}</p>
                        <p>price: {orderItem.priceInCents} cents per unit</p>
                        <p>quantity: {orderItem.quantity} units</p>
                    </Box>
                ))}
                <Box key={"add new item key"}>
                    <Button onClick={onOpen}>
                        add item
                    </Button>
                </Box> 
             </SimpleGrid>
            <Button 
                variant='outline' 
                type="submit" 
                isLoading={isLoading}
                isDisabled={orderItems.length === 0}
            >
                create order
            </Button>
        </form>

        <AddNewItemModal 
            isModalOpen={isOpen} 
            onCloseModal={onClose}
        />
    </>);
}

const AddNewItemModal = ({isModalOpen, onCloseModal}: {isModalOpen: boolean, onCloseModal: () => void}) => {
    return (<>
        <Modal isOpen={isModalOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>add item</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    something
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onCloseModal}>
                        close
                    </Button>
                    <Button variant={'ghost'}>
                        secondary action
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal> 
    </>);
}