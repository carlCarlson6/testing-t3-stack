// WIP

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useSession , signIn , signOut } from "next-auth/react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
    
    return (<>
        {children}
    </>);
};