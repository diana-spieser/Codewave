import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  IconButton,
  useToast,
  Text,
  Box,
  HStack,
  VStack,
  Avatar,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import SingleCommentCard from "./SingleCommentCard";
import getTimeSincePost from "../../common/timeUtils";
import {
  getCommentsByPostId,
  deleteComment,
  editComment,
  likeComment,
  dislikeComment,
} from "../../services/comment.services";
import { AuthContext } from "../../context/authentication-context";
import AuthorModal from "../profile/AuthorModal";
import ConfirmationAlert from "../base/ConfirmationAlert";

function CommentsList({ postId }) {
  const { userData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  useEffect(() => {
    getCommentsByPostId(postId)
      .then((commentsData) => {
        const filteredComments = commentsData.filter(
          (comment) => comment.postId === postId
        );
        setFetchedComments(filteredComments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        setIsLoading(false);
      });
  }, [postId, liked, userData]);

  const handleDeleteComment = (commentId, user) => {
    deleteComment(commentId, user)
      .then(() => {
        const updatedComments = fetchedComments.filter(
          (comment) => comment.id !== commentId
        );
        setFetchedComments(updatedComments);
        toast({
          title: "Comment deleted",
          status: "success",
        });
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the comment.",
          status: "error",
        });
      });
      setShowDeleteAlert(false);
  };

  const handleLikeClick = (user, commentId) => {
    if (userData.likedComments && commentId in userData.likedComments) {
      dislikeComment(user, commentId);
      setLiked(prevLiked => !prevLiked);
    } else {
      likeComment(user, commentId);
      setLiked(prevLiked => !prevLiked);
    }
  };
  
  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  const handleEditComment = (commentId) => {
    if (!editedCommentContent || editedCommentContent.length < 10) {
      toast({
        title: "Validation Error",
        description: "Comment must not be empty and should have at least 10 characters.",
        status: "error",
      });
      return;
    }

    editComment(commentId, editedCommentContent)
      .then(() => {
        const updatedComments = fetchedComments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, content: editedCommentContent };
          }
          return comment;
        });
        setFetchedComments(updatedComments);
        setEditingCommentId(null);
        setEditedCommentContent("");

        toast({
          title: "Comment edited",
          status: "success",
        });
        onClose();
      })
      .catch((error) => {
        console.error("Error editing comment:", error);
        toast({
          title: "Error",
          description: "An error occurred while editing the comment.",
          status: "error",
        });
      });
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  };

  return (
    <Flex
      textAlign="center"
      pt={10}
      justifyContent="center"
      direction="column"
      width="full"
      overflow="hidden"
    >
      <div>
        {fetchedComments.map((comment) => (
          <div key={comment.id}>
            <HStack
              marginTop="2"
              spacing="2"
              display="flex"
              alignItems="center"
              justifyContent="left"
              bg="blue"
              borderRadius="md"
            >
               <Flex direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'center' : 'flex-start'}>
              <Avatar size="sm" src={comment.photoUrl} name={`Avatar`} />
              <AuthorModal authorName={comment.userName}
               authorPhoto={comment.photoUrl}
               authorIdent={comment.authorId} />
               </Flex>
              <Text fontWeight="medium" fontSize={isMobile ? '12px' : 'md'}>Comment by: {comment.userName} </Text>
              <Text display={isMobile && 'none'}>| </Text>
              <Text fontSize={isMobile ? '12px' : 'md'}>{getTimeSincePost(comment.createdOn)}</Text>
              <Text display={isMobile && 'none'}>|</Text>
              <HStack>
                <Popover trigger='hover' placement='top'>
                  <PopoverTrigger>
                    {isMobile ? <VStack marginRight={4}>   <Text fontSize={isMobile ? '12px' : 'md'}>
                        {comment.likedBy && Object.keys(comment.likedBy).length}
                        {!comment.likedBy && 0}
                      </Text>
                      <AiFillHeart color={'red'} /></VStack> : <HStack>   <Text>
                        {comment.likedBy && Object.keys(comment.likedBy).length}
                        {!comment.likedBy && 0}
                      </Text>
                      <AiFillHeart color={'red'} /></HStack>}
                   
                  </PopoverTrigger>
                  <PopoverContent w={'full'}>
                    {comment.likedBy && <PopoverBody>
                  {Object.keys(comment?.likedBy).slice(0, 5).map(user => (<Text key={user}>{user}</Text>))}
                  {(Object.keys(comment?.likedBy).length > 5) && (
                    <Text>{`...and ${(Object.keys(comment?.likedBy).length - 5)} more`}</Text>
                    )}
                  </PopoverBody>}
                  </PopoverContent>
                </Popover>
              </HStack>
              <Flex flexDirection={isMobile ? 'column' : 'row'}>
              {userData &&
                (userData.uid === comment.authorId ||
                  userData.role === "Admin") && (
                  <>
                    <Text display={isMobile && 'none'}>|</Text>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="xs"
                      aria-label="Delete comment"
                      onClick={() => {
                        setSelectedCommentId(comment.id);
                        setShowDeleteAlert(true);}}
                    />
                  </>
                )}
           
              {userData && userData.uid && <IconButton
                icon={comment.likedBy && Object.keys(comment.likedBy).includes(userData.userName) ? <AiFillHeart /> : <AiOutlineHeart />}
                size="xs"
                colorScheme={comment.likedBy && Object.keys(comment.likedBy).includes(userData.userName) ? 'red' : 'gray'}
                aria-label="Like"
              onClick={() => handleLikeClick(userData.userName, comment.id)}
              />}

              </Flex>
          
            </HStack>
            <SingleCommentCard
              content={comment.content}
              commentId={comment.id}
              editPost={handleEditComment}
              authorId={comment.authorId}           
            />
          </div>
        ))}
      </div>
      <ConfirmationAlert
      isOpen={showDeleteAlert}
      onClose={() => setShowDeleteAlert(false)}
      onDelete={() => {
        handleDeleteComment(selectedCommentId, userData.userName);
        setSelectedCommentId(null);
      }}
      message="Are you sure you want to delete this comment? This action cannot be undone."
    />
    </Flex>
  );
}

CommentsList.propTypes = {
  postId: PropTypes.string,
};

export default CommentsList;
