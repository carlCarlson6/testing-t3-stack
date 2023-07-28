import { Flex, Text, Box, List, ListItem } from "@chakra-ui/react";
import { AuthGuard } from "~/ui/auth-guard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { PersonalTasksResume, getPersonalTasksList } from "~/server/personal-tasks/get-personal-tasks-list";
import { prisma } from "~/server/infrastructure/db/prisma";
import { CreateNewTask } from "~/ui/personal-tasks/create-new-task";
import { PersonalTasksList } from "~/ui/personal-tasks/personal-tasks-list";
import { PersonalTasksProvider } from "~/ui/personal-tasks/personal-tasks-state";

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home = ({tasks}: HomeProps) => {
	//const { data } = api.personalTasks.getAllList.useQuery();

	return (<>
		<Flex>
			<Box>
				<PersonalTasksList/>
			</Box>
			<Box p={5}>
				<CreateNewTask />
			</Box>
		</Flex>
	</>);
}

export const getServerSideProps: GetServerSideProps<{tasks: PersonalTasksResume}> = async (context) => {
	const session = await getSession(context)
	const maybeUserId = session?.user.id;
	if (!maybeUserId) return { props: { tasks: [] } }

	var tasks = await getPersonalTasksList(prisma, maybeUserId);
	return { props: { tasks } }
}

export default ({tasks}: HomeProps) => (
	<AuthGuard>
		<PersonalTasksProvider tasks={tasks}>
			<Home tasks={tasks}/>
		</PersonalTasksProvider>
	</AuthGuard>
);