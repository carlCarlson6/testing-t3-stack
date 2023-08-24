import { type AppType } from "next/app";
import { api } from "~/ui/api";
import "~/ui/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

const MyApp: AppType = ({ Component, pageProps }) => (
	<ChakraProvider>
		<Component {...pageProps} />
	</ChakraProvider>
);

export default api.withTRPC(MyApp);
