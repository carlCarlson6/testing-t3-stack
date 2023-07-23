import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, SimpleGrid, Spacer, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useSession , signOut } from "next-auth/react";

export const Layout = ({ children }: { children: React.ReactNode }) => (<>
    <SimpleGrid>
        <Header />
        <Box
            textColor={'white'}
            p={'2.5'}
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
        gap='2'
        backgroundColor={'gray.600'}
    >
        <Heading>
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
            <MenuList>
                    <Button
                        as={MenuItem}
                        onClick={() => signOut()}
                        rightIcon={<CloseIcon/>}
                    >
                        sign out
                    </Button>
                
            </MenuList>
        </Menu>
    </>);
}