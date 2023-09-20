import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  useBreakpointValue,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import IMAGES from '../../assets/Images';
import CustomStatGroup from './CustomStatsGroup';
import useStats from '../../hooks/useStats';
import { useContext } from 'react';
import { AuthContext } from '../../context/authentication-context';
import { LOGIN, REGISTER } from '../../common/Routes';

export default function Cover() {
  const { userData } = useContext(AuthContext);
  const { activeUsers, numberOfPosts, avatarSrc } = useStats();

  return (
    <Stack
      minH={'50vh'}
      direction={{ base: 'column', md: 'row' }}
      bgImage={IMAGES.cover}
      bgSize={'cover'}
    >
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: useBreakpointValue({ base: '20%', md: '30%' }),
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'blue.400',
                zIndex: -1,
              }}
              color={'white'}
            >
              Welcome to Codewave
            </Text>
            <br /> <Text color={'blue.400'} as={'span'}></Text>{' '}
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'white'}>
            The best place to share your knowledge with the world. Join our
            community and start posting today!
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            {!userData && (
              <Button rounded={'full'} bg={'blue'}>
                <Link
                  style={{ textDecoration: 'none' }}
                  as={RouterLink}
                  to={REGISTER}
                >
                  Register
                </Link>
              </Button>
            )}
            {!userData && (
              <Button rounded={'full'} bg={'blue'}>
                <Link
                  style={{ textDecoration: 'none' }}
                  as={RouterLink}
                  to={LOGIN}
                >
                  Login
                </Link>
              </Button>
            )}
          </Stack>
        </Stack>
      </Flex>
      <Flex>
        <Flex>
          <CustomStatGroup
            numberOfPosts={numberOfPosts}
            activeUsers={activeUsers}
            avatarSrc={avatarSrc}
          />
        </Flex>
      </Flex>
    </Stack>
  );
}
