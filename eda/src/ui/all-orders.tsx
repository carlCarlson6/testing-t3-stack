import { Order } from "~/server/orders/order";
import { Table, TableCaption, TableContainer, Tbody, Thead, Tr, Th, Td } from "@chakra-ui/react";

export const AllOrders: React.FC<{orders: Order[]}> = ({orders}) => (<>
    <TableContainer>
        <Table size={'sm'}>
            <TableCaption>list of existing order + status</TableCaption>
            <Thead>
                <Tr>
                    <Th>id</Th>
                    <Th>status</Th>
                </Tr>
            </Thead>
            <Tbody>{orders.map(order => <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.status}</Td>
            </Tr>
            )}</Tbody>
        </Table>
    </TableContainer>
</>)