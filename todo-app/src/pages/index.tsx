import { Button } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react"

const Home = () => {
	const { data: session } = useSession();

	return (<>
		{ session ? "logged" : "not - logged" }
		{ session ? 
			<Button
				onClick={() => signOut()}
			> 
				sign out 
			</Button> : 
			<Button
				onClick={() => signIn()}
			> 
				sign in 
			</Button>
		}
	</>);
}

Home.requiresAuth = true;

export default Home;