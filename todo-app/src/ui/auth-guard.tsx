import { AbsoluteCenter, Box, Center, Container, Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from './layout';

type Props = {
	children: React.ReactElement;
};

export const AuthGuard = ({ children }: Props): JSX.Element => {
	const router = useRouter();
	const { status: sessionStatus } = useSession();
	const isAuthenticated = sessionStatus === 'authenticated';
	const isUnauthenticated = sessionStatus === 'unauthenticated';
	const isLoading = sessionStatus === 'loading';

	useEffect(() => {
		if(isLoading || !router.isReady) return;
		if(isUnauthenticated) router.push('/signin');
	}, [isLoading, isUnauthenticated, sessionStatus, router])

	if (isLoading) return <AppLoadingSpinner />

	return isAuthenticated ? <Layout>{children}</Layout> : <></>;
}

const AppLoadingSpinner = () => (<>
	<Box>
		<Center
			p={'5rem'}
		>
			<Spinner
				thickness='5px'
				speed='0.85s'
				emptyColor='gray.100'
				color='gray.300'
				size='xl'
			/>
		</Center>
	</Box>
</>);