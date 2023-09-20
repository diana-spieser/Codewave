
import { Link } from 'react-router-dom';
import { POST } from '../../common/Routes';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { AiFillHeart } from 'react-icons/ai';
import { BiChat } from 'react-icons/bi';
import { PostTags } from '../posts/PostChakraComponents';
import PropTypes from 'prop-types';

const PostsSearchResults = ({searchResults}) => {
  return (
    <Box py={8} maxW="1200px" mx="auto">
      <Box overflowX="auto">
      {!searchResults.length ? <Text>No results found</Text> : <TableContainer width="100%" overflow="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
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
                {searchResults.map((post) => (
          <Tr key={post.id}>

                  <Td>
                    <Avatar
                      size="sm"
                      src={
                        post.photoUrl ||
                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                      }
                      name={`Avatar of ${post.authorId}`}
                    />
                  </Td>
                  <Td>
                    <Link to={POST.replace(':postId', post.id)}>
                      {post.title}
                    </Link>
                  </Td>
                  <Td>
                    <PostTags tags={Object.keys(post.tags).slice(0, 2)} />
                  </Td>
                  <Td>{new Date(post.createdOn).toLocaleDateString()} </Td>
                  <Td>
                    {post.comments ? Object.keys(post.comments).length : 0}
                  </Td>
                  <Td>{post.likedBy && post.likedBy.length || 0}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>}
      </Box>
    </Box>
  );
};

PostsSearchResults.propTypes = {
  searchResults: PropTypes.array,
};
export default PostsSearchResults;
