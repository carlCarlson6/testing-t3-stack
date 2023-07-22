import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

	if (isLoading) return <>laoding app ...</> // TODO -> add some cool spinner

	return isAuthenticated ? <>{children}</> : <></>;
}