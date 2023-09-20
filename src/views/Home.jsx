
import LandingPagePosts from '../components/posts/LandingPagePosts';
import Cover from '../components/base/Cover';
import HackerNewsArticles from '../components/news/HackerNews';
import { Link } from 'react-router-dom';
import { Box, Flex, Button, Icon } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';

function Home() {
  return (
    <>
      <Cover />
      <Box py={6} maxW="1400px" mx="auto">
        <HackerNewsArticles numArticles={3} />
        <Flex justifyContent={'flex-end'} margin={'auto'}>
          <Button
            as={Link}
            to="/news"
            variant="link"
            color="blue"
            _hover={{ color: 'yellow' }} // Add underline on hover
            rightIcon={<Icon as={FiArrowRight} />}
          >
            Read More
          </Button>
        </Flex>
        <LandingPagePosts />
      </Box>
    </>
  );
}

export default Home;
