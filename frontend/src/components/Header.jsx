// import { Button, Container, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authScreenAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";

// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	const logout = useLogout();
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);

// 	return (
// 		<Container>
// 				<Flex justifyContent={"space-between"} mt={6} mb='12'>
// 			{user && (
// 				<Link as={RouterLink} to='/'>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{/* {!user && (
// 				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
// 					Login
// 				</Link>
// 			)} */}

// 			<Image
// 				cursor={"pointer"}
// 				alt='logo'
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 			/>

// 			{user && (
// 				<Flex alignItems={"center"} gap={4}>
// 					<Link as={RouterLink} to={`/${user.username}`}>
// 						<RxAvatar size={24} />
// 					</Link>
// 					<Link as={RouterLink} to={`/chat`}>
// 						<BsFillChatQuoteFill size={20} />
// 					</Link>
// 					<Link as={RouterLink} to={`/settings`}>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button size={"xs"} onClick={logout}>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{/* {!user && (
// 				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
// 					Sign up
// 				</Link>
// 			)} */}
// 		</Flex>
// 		</Container>

// 	);
// };

// export default Header;
'use client'

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Link,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authScreenAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const NavLink = (props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  return (
    <>
      {
        user && (
          <Box bg={useColorModeValue('gray.100', 'gray.900')} px={6} py={1}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
              <Box>Logo</Box>

              <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                  <Button onClick={toggleColorMode}>
                    {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  </Button>

                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}>
                      <Avatar
                        size={'sm'}
                        src={'https://th.bing.com/th/id/OIP.LcVpI_yA6iH3eR8U6lE8hAHaHa?w=218&h=218&c=7&r=0&o=5&dpr=1.3&pid=1.7'}
                      />
                    </MenuButton>
                    <MenuList alignItems={'center'}>
                      <br />
                      <Center>
                        <Avatar
                          size={'2xl'}
                          src={'https://th.bing.com/th/id/OIP.LcVpI_yA6iH3eR8U6lE8hAHaHa?w=218&h=218&c=7&r=0&o=5&dpr=1.3&pid=1.7'}
                        />
                      </Center>
                      <br />
                      <Center>
                        {/* <Link as={RouterLink} >{user.username}</Link> */}
                      </Center>
                      <br />
                      <MenuDivider />
                      <MenuItem><Link as={RouterLink} to={`/chat`}>Message</Link></MenuItem>
                      {/* <MenuItem><Link as={RouterLink} to={`/${user.username}`}>Profile</Link></MenuItem> */}
                      <MenuItem><Link as={RouterLink} to={`/settings`}>Account Settings</Link></MenuItem>
                      <MenuItem><Button size={"xs"} onClick={logout} >Log out</Button></MenuItem>
                      {/* <Button size={"xs"} onClick={logout}>
                    <FiLogOut size={20} />
                  </Button> */}
                    </MenuList>
                  </Menu>
                </Stack>
              </Flex>
            </Flex>
          </Box>
        )
      }

    </>
  )
}