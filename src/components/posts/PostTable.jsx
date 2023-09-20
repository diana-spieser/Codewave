import { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  VStack,
  Box,
  Text,
  Flex,
  WrapItem,
  Heading,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { POST } from '../../common/Routes';
import { AiFillHeart } from 'react-icons/ai';
import { BiChat } from 'react-icons/bi';
import PropTypes from 'prop-types';
import { PostTags} from './PostChakraComponents.jsx';

const PostTable = ({ posts }) => {
  const [sortingColumn, setSortingColumn] = useState('createdOn');
  const [sortingOrder, setSortingOrder] = useState('desc');

  const handleSorting = (column) => {
    if (column === sortingColumn) {
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingColumn(column);
      setSortingOrder('desc');
    }
  };

  const getSortingIcon = (column) => {
    if (sortingColumn === column) {
      return sortingOrder === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  const sortedPosts = posts.slice().sort((a, b) => {
    if (sortingColumn === 'createdOn') {
      return (
        (sortingOrder === 'asc' ? 1 : -1) *
        (new Date(a.createdOn) - new Date(b.createdOn))
      );
    } else if (sortingColumn === 'comments') {
      return (
        (sortingOrder === 'asc' ? 1 : -1) *
        ((a.comments ? Object.keys(a.comments).length : 0) -
          (b.comments ? Object.keys(b.comments).length : 0))
      );
    } else if (sortingColumn === 'likedBy') {
      return (
        (sortingOrder === 'asc' ? 1 : -1) *
        (a.likedBy.length - b.likedBy.length)
      );
    } else if (sortingColumn === 'authorId') {
      return (
        (sortingOrder === 'asc' ? 1 : -1) * a.authorId.localeCompare(b.authorId)
      );
    } else if (sortingColumn === 'title') {
      return (sortingOrder === 'asc' ? 1 : -1) * a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <VStack width="100%">
      <Table variant="simple">
        <Thead display={{ base: 'none', md: 'table-header-group' }}>
          <Tr>
            <Th
              onClick={() => handleSorting('authorId')}
              style={{ cursor: 'pointer' }}
            >
              Author {getSortingIcon('authorId')}
            </Th>
            <Th
              onClick={() => handleSorting('title')}
              style={{ cursor: 'pointer' }}
            >
              Title {getSortingIcon('title')}
            </Th>

            <Th>Tags</Th>
            <Th
              onClick={() => handleSorting('createdOn')}
              style={{ cursor: 'pointer' }}
            >
              Created On {getSortingIcon('createdOn')}
            </Th>
            <Th
              onClick={() => handleSorting('comments')}
              style={{ cursor: 'pointer' }}
            >
              <BiChat /> {getSortingIcon('comments')}
            </Th>
            <Th
              onClick={() => handleSorting('likedBy')}
              style={{ cursor: 'pointer' }}
            >
              <AiFillHeart /> {getSortingIcon('likedBy')}
            </Th>
          </Tr>
        </Thead>
        <Tbody display={{ base: 'none', md: 'table-row-group' }}>
          {sortedPosts.map((post) => (
            <Tr key={post.id}>
              <Td>
                <Avatar
                  size="sm"
                  src={post.photoUrl || 'default-avatar-url'}
                  name={`Avatar of ${post.authorId}`}
                />
              </Td>
              <Td>
                <Link to={POST.replace(':postId', post.id)}>{post.title}</Link>
              </Td>
              <Td>
                <PostTags tags={Object.keys(post.tags).slice(0, 2)} />
              </Td>
              <Td display={{ base: 'none', md: 'table-cell' }}>
                <Text as="span">
                  {new Date(post.createdOn).toLocaleDateString()}
                </Text>
              </Td>
              <Td display={{ base: 'none', md: 'table-cell' }}>
                <Text as="span">
                  {post.comments ? Object.keys(post.comments).length : 0}
                </Text>
              </Td>
              <Td display={{ base: 'none', md: 'table-cell' }}>
                <Text as="span">{post.likedBy.length}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <VStack width="100%" display={{ base: 'flex', md: 'none' }}>
        {sortedPosts.map((post) => (
          <WrapItem key={post.id} width="100%">
            <Box>
              <Flex alignItems="center">
                <Avatar
                  size="sm"
                  src={post.photoUrl || 'default-avatar-url'}
                  name={`Avatar of ${post.authorId}`}
                  mr={2}
                />
                <VStack alignItems="flex-start" spacing={1}>
                  <Heading fontSize="md" mb={1}>
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                  </Heading>
                  <Text as="p" fontSize="sm" color="gray.500">
                    {new Date(post.createdOn).toLocaleDateString()}
                  </Text>
                  <Flex justifyContent="space-between" width="100%">
                    <Text fontSize="sm">
                      <BiChat />{' '}
                      {post.comments ? Object.keys(post.comments).length : 0}
                    </Text>
                    <Text fontSize="sm">
                      <AiFillHeart /> {post.likedBy.length}
                    </Text>
                  </Flex>
                </VStack>
              </Flex>
            </Box>
          </WrapItem>
        ))}
      </VStack>
    </VStack>
  );
};

PostTable.propTypes = {
  posts: PropTypes.array,
};

export default PostTable;
