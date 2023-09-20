import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authentication-context';
import { addComment } from '../../services/comment.services';
import {
  Textarea,
  Button,
  Flex,
  useColorModeValue,
  useToast,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function NewComment({ postId, onCommentAdded }) {
  const { user, userData } = useContext(AuthContext);
  const [value, setValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCommentValid, setIsCommentValid] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const isValid = value.length >= 10 && value.length <= 300;
    setIsCommentValid(isValid);
  }, [value]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (isCommentValid) {
      const createdOn = Date.now();
      const { uid } = user;
      const { userName, photoUrl } = userData;
      addComment(value, uid, postId, userName, photoUrl, createdOn)
        .then((comment) => {
          const commentId = comment.id;
          onCommentAdded();
          setValue('');
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
          toast({
            title: 'Error adding comment',
            description: 'An error occurred while adding the comment.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: 'Invalid Comment',
        description: 'Please enter a comment between 10 and 300 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      boxShadow={'lg'}
      maxW={'1200px'}
      width={'full'}
      rounded={'xl'}
      mb={4}
      p={10}
      bg={useColorModeValue('white', 'gray.800')}
      justifyContent={'space-between'}
      position={'relative'}
      as="form"
      onSubmit={handleAddComment}
      direction="column"
      marginTop={4}
    >
      <Flex
        direction={'column'}
        textAlign={'left'}
        justifyContent={'space-between'}
      >
        {userData.isBlocked === false ? (
          <Flex direction="column" align="center">
            {' '}
            <Textarea
              value={value}
              onChange={handleInputChange}
              placeholder="Add a comment..."
              marginTop={2}
              resize="none"
              size="sm"
              borderColor={useColorModeValue('white', 'gray.800')}
            />
            <Flex>
              <Button bg="blue" mt={4} type="submit" disabled={!isCommentValid}>
                Publish
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Text
            fontSize="lg"
            color="red.500"
            fontWeight="bold"
            textAlign="center"
            p={4}
            border="2px solid red"
            borderRadius="md"
            backgroundColor="red.100"
          >
            You are blocked{' '}
          </Text>
        )}
        {isSubmitted && !isCommentValid && (
          <FormErrorMessage>
            Comment must be between 10 and 300 characters.
          </FormErrorMessage>
        )}
      </Flex>
    </Flex>
  );
}

NewComment.propTypes = {
  postId: PropTypes.string,
  onCommentAdded: PropTypes.func,
};

export default NewComment;
