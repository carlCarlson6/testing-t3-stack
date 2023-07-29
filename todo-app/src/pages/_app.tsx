import { Box, ChakraProvider } from "@chakra-ui/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/app";
import Head from "next/head";
import { api } from "~/ui/api";
import { Layout } from "~/ui/layout";
import "~/ui/layout.css"

const MyApp: AppType<{session: Session | null}> = ({
  	Component,
  	pageProps: { session, ...pageProps },
}) => (<>
	<AppDocumentHeader />
	<SessionProvider session={session}>
		<ChakraProvider>
			<Box
				p={2}
				backgroundColor={'gray.800'}
				minHeight="100vh"
				textColor={'white'}
			>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</Box>
		</ChakraProvider>
	</SessionProvider>
</>);

const AppDocumentHeader = () => (
	<Head>
		<title>TODO APP</title>
		<meta name="description" content="Generated by create-t3-app" />
		<link rel="icon" href="/favicon.ico" />
	</Head>
);

export default api.withTRPC(MyApp);
