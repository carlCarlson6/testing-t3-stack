import { Box, Container, Flex, List, ListItem, Spacer, Table, TableCaption, TableContainer, Tbody, Text, Thead, Tr, Th, Td } from "@chakra-ui/react";
import { kv } from "@vercel/kv";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { prisma } from "~/server/infrastructure/prisma";
import { getAllOrdersFromDataSources } from "~/server/orders/get-orders";
import { Order } from "~/server/orders/order";
import { AllOrders } from "~/ui/all-orders";
import { CreateOrderForm } from "~/ui/create-order-form";

const Home = ({ orders }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (<>		
		<Flex>
			<Box border="1px" rounded="2xl" minHeight="96.5vh" padding="1.5rem" margin="1rem">
				<CreateOrderForm />
			</Box>
			<Box border="1px" rounded="2xl" minHeight="96.5vh" padding="1.5rem" margin="1rem">
				<Text>list of existing order + status</Text>
				<AllOrders orders={orders}/>
			</Box>
		</Flex>	
	</>);
}

export const getServerSideProps: GetServerSideProps<{orders: Order[]}> = async () => {
	const orders = await getAllOrdersFromDataSources(prisma, kv)();
	return {
		props: {
			orders: JSON.parse(JSON.stringify(orders))
		}
	};
}

export default Home;
