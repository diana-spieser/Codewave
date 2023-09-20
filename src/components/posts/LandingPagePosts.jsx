import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Heading,
  Divider,
  VStack,
  Flex,
  WrapItem,
  Box,
  Text,
} from '@chakra-ui/react';
import { BiChat } from 'react-icons/bi';
import { AiFillHeart } from 'react-icons/ai';
import { getAllPosts } from '../../services/post.services.js';
import {
  sortPostsByDate,
  sortPostsByComments,
} from '../../common/sortingFunctions';
import { PostTags, PostFilter } from './PostChakraComponents.jsx';

const LandingPagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Top Trending');

  useEffect(() => {
    getAllPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, [selectedFilter]);

  const sortedPosts =
    selectedFilter === 'Most Recent'
      ? sortPostsByDate(posts).slice(0, 10)
      : sortPostsByComments(posts).slice(0, 10);

  return (
    <VStack spacing={6} alignItems="flex-start" p={12}>
      <Flex
        justifyContent={'space-between'}
        width={'full'}
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Heading
          as="h2"
          color={'blue'}
          fontSize={{ base: 'xl', md: '4xl' }}
          mb={{ base: 4, md: 0 }}
        >
          Our Top 10 Posts
        </Heading>
        <PostFilter
          options={['Top Trending', 'Most Recent']}
          selectedCategory={selectedFilter}
          onChange={(value) => setSelectedFilter(value)}
          fontSize={{ base: 'sm', md: 'md' }}
        />
      </Flex>
      <Divider />

      <VStack width="100%" display={{ base: 'none', md: 'flex' }}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Author</Th>
              <Th>Title</Th>
              <Th>Tags</Th>
              <Th>Created On</Th>
              <Th>
                <BiChat />
              </Th>
              <Th>
                <AiFillHeart />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedPosts.map((post, index) => (
              <Tr key={post.id}>
                <Td>{index + 1}</Td>
                <Td>
                  <Avatar
                    size="sm"
                    src={post.photoUrl || 'default-avatar-url'}
                    name={`Avatar of ${post.authorId}`}
                  />
                </Td>
                <Td>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </Td>
                <Td>
                  <PostTags tags={Object.keys(post.tags).slice(0, 2)} />
                </Td>
                <Td>{new Date(post.createdOn).toLocaleDateString()}</Td>
                <Td>{post.comments ? Object.keys(post.comments).length : 0}</Td>
                <Td>{post.likedBy ? post.likedBy.length : 0}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>

      <VStack width="100%" display={{ base: 'flex', md: 'none' }}>
        {sortedPosts.map((post, index) => (
          <WrapItem key={post.id} width="100%">
            <Box>
              <Heading fontSize="md" mb={2}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </Heading>
              <Text as="p" fontSize="sm" color="gray.500">
                {new Date(post.createdOn).toLocaleDateString()}
              </Text>
              <Flex justifyContent="space-between">
                <Text fontSize="sm">
                  <BiChat />{' '}
                  {post.comments ? Object.keys(post.comments).length : 0}
                </Text>
                <Text fontSize="sm">
                  <AiFillHeart /> {post.likedBy ? post.likedBy.length : 0}
                </Text>
              </Flex>
            </Box>
          </WrapItem>
        ))}
      </VStack>
    </VStack>
  );
};

export default LandingPagePosts;
