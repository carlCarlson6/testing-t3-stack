import { ChakraProvider } from "@chakra-ui/react";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps, type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/ui/api";
import { Layout } from "~/ui/layout";
import { AuthGuard } from "~/ui/auth-guard";

type AppPropsWithAuth = AppProps & {
	Component: {
		requiresAuth?: boolean;
	}
} & 
{
	pageProps: {session: Session | null}
};

const MyApp = ({
  	Component,
  	pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => (<>
	<AppDocumentHeader />
	<SessionProvider session={session}>
		<ChakraProvider>
			<Layout>
				{ Component.requiresAuth ?
					<AuthGuard>
						<Component {...pageProps} />
					</AuthGuard> :
					<Component {...pageProps} />
				}
			</Layout>
		</ChakraProvider>
	</SessionProvider>
</>);

const AppDocumentHeader = () => (
	<Head>
		<title>TODO</title>
		<meta name="description" content="Generated by create-t3-app" />
		<link rel="icon" href="/favicon.ico" />
	</Head>
);

export default api.withTRPC(MyApp);
