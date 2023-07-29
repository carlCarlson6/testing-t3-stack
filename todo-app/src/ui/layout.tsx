import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, SimpleGrid, Spacer, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, Icon } from "@chakra-ui/react";
import { useSession , signOut, signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

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
                <MenuList
                    backgroundColor={'gray.700'}
                    borderColor={'gray.500'}
                >{ !session ?
                        <Button
                            backgroundColor={'gray.700'}
                            _hover={{ bg: 'gray.600' }}
                            as={MenuItem}
                            onClick={() => {signIn().catch(_ => {return;})}}
                            rightIcon={<DiscordIcon/>}
                            textColor={'white'}
                        >
                            sign in
                        </Button> : 
                        <Button
                            backgroundColor={'gray.700'}
                            _hover={{ bg: 'gray.600' }}
                            as={MenuItem}
                            onClick={() => {signOut().catch(_ => {return;})}}
                            rightIcon={<CloseIcon/>}
                            textColor={'white'}
                        >
                            sign out
                        </Button>
                }</MenuList>
            </Menu>
        </Box>
    </>);
}

export const DiscordIcon = () => (<>
	<Icon as={FaDiscord} />
</>);