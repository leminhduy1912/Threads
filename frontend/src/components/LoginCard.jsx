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

export default function LoginCard() {
  const text = 'Welcome to \nThreads Sign in your account'; // Modified with \n for line break
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
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const showToast = useShowToast();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await clientRequest.post('api/users/signin', inputs);
      const data = res.data;
      console.log('login data', data);

      if (data.error) {
        showToast('Error', data.error, 'error');
        setLoading(false);
        return;
      }

      localStorage.setItem('user-threads', JSON.stringify(data));
      setUser(data);
      setLoading(false);
    } catch (error) {
      showToast('Error', error.message || 'Something went wrong', 'error');
      setLoading(false);
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

          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={inputs.username}
              onChange={(e) =>
                setInputs((inputs) => ({ ...inputs, username: e.target.value }))
              }
            />
          </FormControl>
          <FormControl id="password">
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
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}
            >
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack>
            <Button
              loadingText="Logging in"
              size="lg"
              bg={useColorModeValue('gray.600', 'gray.700')}
              color={'white'}
              _hover={{
                bg: useColorModeValue('gray.700', 'gray.800'),
              }}
              onClick={handleLogin}
              isLoading={loading}
            >
              Login
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              Don&apos;t have an account?{' '}
              <Link
                color={'blue.400'}
                cursor={'pointer'}
                onClick={() => setAuthScreen('signup')}
                style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Sign up
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
