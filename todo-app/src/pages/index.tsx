import { Flex, Box } from "@chakra-ui/react";
import { AuthGuard } from "~/ui/auth-guard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { getPersonalTasksList } from "~/server/personal-tasks/get-personal-tasks-list";
import { prisma } from "~/server/infrastructure/db/prisma";
import { PersonalTasksList } from "~/ui/personal-tasks/personal-tasks-list";
import { PersonalTasksProvider, usePersonalTasks } from "~/ui/personal-tasks/personal-tasks-state";
import { PersonalTasksResume } from "~/server/personal-tasks/personal-task";
import { TaskDetailView } from "~/ui/personal-tasks/task-detail-view";

const Home = () => (<>
	<Flex>
		<Box>
			<PersonalTasksList />
		</Box>
		<Box p={5}>
			<TaskDetailView />
		</Box>
	</Flex>
</>)

export const getServerSideProps: GetServerSideProps<{tasks: PersonalTasksResume}> = async (context) => {
	const session = await getSession(context)
	const maybeUserId = session?.user.id;
	if (!maybeUserId) return { props: { tasks: [] } }

	var tasks = await getPersonalTasksList(prisma, maybeUserId);
	return { props: { tasks } }
}

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default ({tasks}: HomeProps) => (
	<AuthGuard>
		<PersonalTasksProvider tasks={tasks}>
			<Home/>
		</PersonalTasksProvider>
	</AuthGuard>
);