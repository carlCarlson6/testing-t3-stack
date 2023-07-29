import { Button, Text, AbsoluteCenter, Box, VStack } from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { DiscordIcon } from "~/ui/layout";

const SignIn =() => (<>
	<Box position='relative' h='50vh'>
		<AbsoluteCenter axis='both'>
			<VStack spacing={8}>
				<Box>
					<Text>
						organize your work with ease
					</Text>
				</Box>
				<Box>
					<Button
						onClick={() => {signIn().catch(_ => {return;});}}
						rightIcon={<DiscordIcon />}
						_hover={{
							bg: 'gray.400'
						}}
					>
						<Text>sign in</Text>
					</Button>
				</Box>
			</VStack>
		</AbsoluteCenter>
	</Box>
</>)

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return { props: { session } }
}

export default SignIn;