import { Button, Text, AbsoluteCenter, Box, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";

const SignIn =() => {
    return (<Box position='relative' h='50vh'>
        <AbsoluteCenter axis='both'>
			<VStack spacing={8}>
				<Box>
					<Text>
						organize your work with ease
					</Text>
				</Box>
				<Box>
					<Button
						onClick={() => signIn()}
					>
						<Text>sign in :)</Text>
					</Button>
				</Box>
			</VStack>
        </AbsoluteCenter>
    </Box>);
}

export default SignIn;

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
