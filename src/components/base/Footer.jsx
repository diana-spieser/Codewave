
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { FaGitlab } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      as="footer"
      py="4"
      position="absolute"
      left="0"
      bottom="0"
      zIndex="3"
      height="60px"
      width="100%"
      mt={4}
    >
      <Flex justifyContent="center" alignItems="center" px="4">
        <Text marginRight={'15px'} color={'blue'}>
          &copy; {new Date().getFullYear()} Code Wave
        </Text>
        <Link href="https://gitlab.com/Georgi_Naydenov/codewave" isExternal>
          <Icon
            as={FaGitlab}
            boxSize={6}
            color="green"
            _hover={{ color: 'yellow' }}
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Footer;
