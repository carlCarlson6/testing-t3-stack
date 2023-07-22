import { Button, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";

const SignIn =() => {
    return (<>
        <Button
            onClick={() => signIn()}
        >
            <Text>sign in :)</Text>
        </Button>
    </>);
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

	return {
		props: { session }
	}
}
