import { useState, useEffect } from 'react';
import {
  Text,
  HStack,
  VStack,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TabList,
  Flex,
} from '@chakra-ui/react';

import {
  getAllPostsFromUser,
  getAllCommentsFromUser,
  getLikedPosts,
} from '../../services/post.services';
import PostList from './PostList';
import CommentList from './CommentList';
import { useContext } from 'react';
import { AuthContext } from '../../context/authentication-context';
import PropTypes from 'prop-types';

function PostAndComment({ authorId, authorName }) {
  const { user, userData } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    getAllPostsFromUser(authorId)
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error('Error fetching posts:', error));

    getAllCommentsFromUser(authorId)
      .then((data) => {
        setComments(data);
      })
      .catch((error) => console.error('Error fetching comments:', error));

    getLikedPosts(authorName)
      .then((likedPosts) => {
        setLikedPosts(likedPosts);
      })
      .catch((error) => {
        console.error('Error fetching liked posts:', error);
      });
  }, [authorId]);

  return (
    <>
      <VStack spacing="4" align="stretch">
        <Flex justifyContent="center" alignItems="center">
          <HStack>
            <Text fontWeight="bold">Posts: {posts.length}</Text>
            <Text fontWeight="bold">Comments: {comments.length}</Text>
          </HStack>
        </Flex>

        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Posts</Tab>
            <Tab>Comments</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <PostList posts={posts} likedPosts={likedPosts} />
            </TabPanel>
            <TabPanel>
              <CommentList comments={comments} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </>
  );
}

PostAndComment.propTypes = {
  authorId: PropTypes.string,
  authorName: PropTypes.string,
};
export default PostAndComment;
