import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  IconButton,
  Avatar,
  Flex,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useBreakpointValue,
} from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BiChat } from 'react-icons/bi';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, likePost, dislikePost } from '../../services/post.services';
import { PostTags } from './PostChakraComponents';
import { AuthContext } from '../../context/authentication-context';
import { deletePost } from '../../services/user.service';
import EditPostModal from './EditPostModal';
import AuthorModal from '../profile/AuthorModal';
import PropTypes from 'prop-types';
import ConfirmationAlert from '../base/ConfirmationAlert';

const SinglePost = ({ commentAdded }) => {
  const { userData } = useContext(AuthContext);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [edit, setEdit] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { postId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getPostById(postId)
      .then((data) => {
        setPost(data);
        setCommentCount(data.comments ? Object.keys(data.comments).length : 0);
      })
      .catch((error) => console.error('Error fetching post:', error));

    if (userData && userData.likedPosts && postId in userData.likedPosts) {
      setLiked(true);
    } else {
      setLiked(false);
    }

  }, [commentAdded, postId, userData]);


  const handleLikeClick = (user, postId) => {
    if (userData.likedPosts && postId in userData.likedPosts) {
      dislikePost(user, postId);
    } else {
      likePost(user, postId);
    }
  };

  const handleDelete = (handle) => {
    deletePost(handle);
    navigate('/');
  }

  const getTimeSincePost = (timestamp) => {
    const postDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - postDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return `Posted now`
    }
  }

  if (!post) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <Heading as="h1">{post.categoryId}</Heading>
      <Box marginTop={{ base: '1', sm: '5' }}>
        <PostTags tags={Object.keys(post.tags)} />
        <Flex flexDirection={isMobile ? 'column' : 'row'} align="center">
          <Heading marginTop="1" flex="1">
            <Text textDecoration="none" _hover={{ textDecoration: 'none' }}>
              {post.title}
            </Text>
          </Heading>
          <Box>
          {userData && <IconButton
            icon={liked ? <AiFillHeart /> : <AiOutlineHeart />}
            colorScheme={liked ? 'red' : 'gray'}
            aria-label="Like"
            onClick={() => handleLikeClick(userData.userName, postId)}
          />}

          {userData && (post.authorId === userData?.uid || userData?.role === "Admin") && <Button size='md' colorScheme='gray' ml={2}
            onClick={() => setEdit(true)}
          >
            <EditIcon size='xs' />
          </Button>}
          {userData && (post.authorId === userData?.uid || userData?.role === "Admin") && <Button size='md' colorScheme='gray' ml={2}
            onClick={() => setShowDeleteAlert(true)}>
            <DeleteIcon size='xs' />
          </Button>}


          </Box>
          <EditPostModal
            isOpen={edit}
            onClose={() => setEdit(false)}
            post={post}
          />
        </Flex>
        <Text as="p" marginTop="2" marginBottom='5'  fontSize={isMobile ? '12px' : 'lg'}>
          {post.content}
        </Text>
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
          <Flex direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'center' : 'flex-start'}>
          <Avatar
            size="sm"
            src={
              post.photoUrl
            }
            onClick={() => setIsAuthorModalOpen(true)}
            name={`Avatar of ${post.authorId}`}
          />
         {isAuthorModalOpen && (
        <AuthorModal 
          authorName={post.userName}
          authorPhoto={post.photoUrl}
          authorIdent={post.authorId}
          onClose={() => setIsAuthorModalOpen(false)}
        />
      )}
          </Flex>

          <Text fontWeight="medium" fontSize={isMobile ? '12px' : 'md'} align={'center'}>Written by: {post.userName}</Text>
          <Text display={isMobile && 'none'}>|</Text>
          <Text fontSize={isMobile ? '12px' : 'md'} align={'center'}>Published on: {post.createdOn.toLocaleDateString()} </Text>
          <Text display={isMobile && 'none'}>|</Text>
          <Text fontSize={isMobile ? '12px' : 'md'} align={'center'}>{getTimeSincePost(post.createdOn)}</Text>
          <Text display={isMobile && 'none'}>|</Text>
          <HStack>
            <Popover trigger='hover' placement='top'>
              <PopoverTrigger>
                {isMobile ? <VStack>
                  <Text >{Object.keys(post.likedBy).length}</Text>
                  <AiFillHeart color={'red'} />
                </VStack> : <HStack>
                  <Text >{Object.keys(post.likedBy).length}</Text>
                  <AiFillHeart color={'red'} />
                </HStack> }
                
              </PopoverTrigger>
              <PopoverContent w={'full'}>
                {(Object.keys(post.likedBy).length > 0) && <PopoverBody>
                  {Object.keys(post.likedBy).slice(0, 5).map(user => (<Text key={user}>{user}</Text>))}
                  {(Object.keys(post.likedBy).length > 5) && (
                    <Text>{`...and ${(Object.keys(post.likedBy).length - 5)} more`}</Text>
                  )}
                </PopoverBody>}
              </PopoverContent>
            </Popover>
          </HStack>
          <Text display={isMobile && 'none'}>|</Text>
          {isMobile ? <VStack>
          <Text>
            {commentCount}
          </Text> 
          <Text>
            {' '}
            <BiChat />
          </Text></VStack> : <HStack> <Text>
            {' '}
            <BiChat />
          </Text>
          <Text>
            {commentCount}
          </Text></HStack>}
     
        </HStack>
        <HStack>
        </HStack>
      </Box>
      <ConfirmationAlert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onDelete={() => handleDelete(post.id)}
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  );
};

SinglePost.propTypes = {
  commentAdded: PropTypes.bool,
};

export default SinglePost;
