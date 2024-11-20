// import { Box, Button, Flex, FormControl, FormLabel, Heading, HStack, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import useShowToast from "../hooks/useShowToast";
// import { useState } from "react";
// import { useSetRecoilState } from "recoil";
// import authScreenAtom from "../atoms/authScreenAtom";
// import userAtom from "../atoms/userAtom";

// import { clientRequest } from "../api/clientRequest";

// const SignUpCard = () => {
//     const [showPassword, setShowPassword] = useState(false);
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);
// 	const [inputs, setInputs] = useState({
// 		name: "",
// 		username: "",
// 		email: "",
// 		password: "",
// 	});

// 	const showToast = useShowToast();
// 	const setUser = useSetRecoilState(userAtom);

// 	const handleSignup = async () => {
// 		try {
// 			// `axios.post` takes the URL and the data object directly
// 			const res = await clientRequest.post(`api/users/signup`, inputs);
	
// 			// You don't need to call `.json()` with axios; it parses the response automatically
// 			const data = res.data;
	
// 			// Check if there's an error in the response
// 			if (data.error) {
// 				showToast("Error", data.error, "error");
// 				return;
// 			}
	
// 			// Save data to localStorage and update state
// 			localStorage.setItem("user-threads", JSON.stringify(data));
// 			setUser(data);
// 		} catch (error) {
// 			// Handle any errors that occur during the request
// 			showToast("Error", error.message || "Something went wrong", "error");
// 		}
// 	};
	

// 	return (
// 		<Flex align={"center"} justify={"center"}>
// 			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
// 				<Stack align={"center"}>
// 					<Heading fontSize={"4xl"} textAlign={"center"}>
// 						Sign up
// 					</Heading>
// 				</Stack>
// 				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
// 					<Stack spacing={4}>
// 						<HStack>
// 							<Box>
// 								<FormControl isRequired>
// 									<FormLabel>Full name</FormLabel>
// 									<Input
// 										type='text'
// 										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
// 										value={inputs.name}
// 									/>
// 								</FormControl>
// 							</Box>
// 							<Box>
// 								<FormControl isRequired>
// 									<FormLabel>Username</FormLabel>
// 									<Input
// 										type='text'
// 										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
// 										value={inputs.username}
// 									/>
// 								</FormControl>
// 							</Box>
// 						</HStack>
// 						<FormControl isRequired>
// 							<FormLabel>Email address</FormLabel>
// 							<Input
// 								type='email'
// 								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
// 								value={inputs.email}
// 							/>
// 						</FormControl>
// 						<FormControl isRequired>
// 							<FormLabel>Password</FormLabel>
// 							<InputGroup>
// 								<Input
// 									type={showPassword ? "text" : "password"}
// 									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
// 									value={inputs.password}
// 								/>
// 								<InputRightElement h={"full"}>
// 									<Button
// 										variant={"ghost"}
// 										onClick={() => setShowPassword((showPassword) => !showPassword)}
// 									>
// 										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
// 									</Button>
// 								</InputRightElement>
// 							</InputGroup>
// 						</FormControl>
// 						<Stack spacing={10} pt={2}>
// 							<Button
// 								loadingText='Submitting'
// 								size='lg'
// 								bg={useColorModeValue("gray.600", "gray.700")}
// 								color={"white"}
// 								_hover={{
// 									bg: useColorModeValue("gray.700", "gray.800"),
// 								}}
// 								onClick={handleSignup}
// 							>
// 								Sign up
// 							</Button>
// 						</Stack>
// 						<Stack pt={6}>
// 							<Text align={"center"}>
// 								Already a user?{" "}
// 								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
// 									Login
// 								</Link>
// 							</Text>
// 						</Stack>
// 					</Stack>
// 				</Box>
// 			</Stack>
// 		</Flex>
// 	);
// }

// export default SignUpCard



'use client';

import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  InputGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authScreenAtom';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
import { clientRequest } from '../api/clientRequest';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Styled components for animation
const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  white-space: pre-line; 
`;

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  white-space: nowrap;
`;

const Character = styled(motion.span)`
  display: inline-block;
  margin-right: -0.05em;
`;

export default function SignUpCard() {
  const text = 'Welcome to \nThreads Sign up your account'; // Modified with \n for line break
  const ctrls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      ctrls.start('visible');
    } else {
      ctrls.start('hidden');
    }
  }, [ctrls, inView]);

  const characterAnimation = {
    hidden: { opacity: 0, y: '0.25em' },
    visible: {
      opacity: 1,
      y: '0em',
      transition: {
        duration: 5.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

    const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);

	const handleSignup = async () => {
		try {
			// `axios.post` takes the URL and the data object directly
			const res = await clientRequest.post(`api/users/signup`, inputs);
	
			// You don't need to call `.json()` with axios; it parses the response automatically
			const data = res.data;
	
			// Check if there's an error in the response
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
	
			// Save data to localStorage and update state
			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			// Handle any errors that occur during the request
			showToast("Error", error.message || "Something went wrong", "error");
		}
	};

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}></Heading>
          <Title aria-label={text} role="heading">
            {text.split(' ').map((word, index) => (
              <Word
                ref={ref}
                aria-hidden="true"
                key={index}
                initial="hidden"
                animate={ctrls}
                variants={{}}
                transition={{
                  delayChildren: index * 0.25,
                  staggerChildren: 0.05,
                }}
              >
                {word.split('').map((character, index) => (
                  <Character
                    aria-hidden="true"
                    key={index}
                    variants={characterAnimation}
                  >
                    {character}
                  </Character>
                ))}
              </Word>
            ))}
          </Title>
		   								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
									placeholder='Enter username'
									type='text'
										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
										value={inputs.username}
									/>
 								</FormControl>
								<FormControl isRequired>
									<FormLabel>Full name</FormLabel>
									<Input
									placeholder='Enter fullname'
 										type='text'
 										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
 										value={inputs.name}
 									/>
 								</FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={inputs.email}
              onChange={(e) =>
                setInputs((inputs) => ({ ...inputs, email: e.target.value }))
              }
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={inputs.password}
                onChange={(e) =>
                  setInputs((inputs) => ({ ...inputs, password: e.target.value }))
                }
              />
            </InputGroup>
          </FormControl>
          <Stack spacing={6}>
            {/* <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}
            >
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack> */}
            <Button
              loadingText="Submiting"
              size="lg"
              bg={useColorModeValue('gray.600', 'gray.700')}
              color={'white'}
              _hover={{
                bg: useColorModeValue('gray.700', 'gray.800'),
              }}
              onClick={handleSignup}
            //   isLoading={loading}
            >
              Sign Up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
               Have an account ?{' '}
              <Link
                color={'blue.400'}
                cursor={'pointer'}
                onClick={() => setAuthScreen('login')}
				style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Sign in
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://static.vecteezy.com/system/resources/previews/029/296/945/original/say-more-campaign-by-threads-instagram-app-design-system-threads-logo-with-different-colors-threads-by-meta-threads-social-network-by-instagram-social-network-july-20-2023-dhaka-bangladesh-free-png.png'
          }
        />
      </Flex>
    </Stack>
  );
}
