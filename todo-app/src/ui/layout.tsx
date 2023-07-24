import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, SimpleGrid, Spacer, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useSession , signOut, signIn } from "next-auth/react";

export const Layout = ({ children }: { children: React.ReactNode }) => (<>
    <SimpleGrid>
        <Header />
        <Box
            textColor={'white'}
            p={'5'}
        >
            {children}
        </Box>
    </SimpleGrid>
</>);

const Header = () => (<>
    <Flex
        p='2'
        minWidth='max-content'
        alignItems='center'
        paddingBottom={3}
        backgroundColor={'gray.900'}
        border={'1px'}
        borderRadius={'3xl'}
        borderColor={'gray.700'}
    >
        <Heading size={'lg'} marginLeft={'1rem'}>
            <Text>T3 TODO APP</Text>
        </Heading>
        <Spacer />
        <UserAvatar />
    </Flex>
</>);

const UserAvatar = () => {
    const { data: session } = useSession();
    const avatarImage = session?.user.image ?? 'https://bit.ly/broken-link';
    const userName = session?.user.name ?? 'not-known-name';
    
    return (<>
        <Box marginRight={'0.5rem'}>
            <Menu>
                <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                >
                    <Avatar size={"md"} name={userName} src={avatarImage}/>
                </MenuButton>
                <MenuList>{ !session ?
                        <Button
                            as={MenuItem}
                            onClick={() => signIn()}
                            rightIcon={<CheckIcon/>}
                        >
                            sign in
                        </Button> : 
                        <Button
                            as={MenuItem}
                            onClick={() => signOut()}
                            rightIcon={<CloseIcon/>}
                        >
                            sign out
                        </Button>
                }</MenuList>
            </Menu>
        </Box>
    </>);
}