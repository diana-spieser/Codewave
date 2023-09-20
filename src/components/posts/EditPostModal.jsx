import { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Button,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react';
import {
  MIN_TITLE_LEN,
  MAX_TITLE_LEN,
  MIN_CONTENT_LEN,
  MAX_CONTENT_LEN,
  MIN_TAG_LEN,
  MAX_TAG_LEN,
  MIN_TAG_NUM,
  MAX_TAG_NUM,
} from '../../common/Common';
import { editPost } from '../../services/user.service';
import { addTag, removeTag } from '../../services/post.services';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthContext } from '../../context/authentication-context';

const EditPostModal = ({ isOpen, onClose, post }) => {
  const [tagInput, setTagInput] = useState('');
  const [newContent, setNewContent] = useState({
    title: post.title,
    content: post.content,
    tags: Object.keys(post.tags),
  });
  const [removedTags, setRemovedTags] = useState([]);
  const [errors, setErrors] = useState({});
  const { userData } = useContext(AuthContext);
  useEffect(() => {
    if (isOpen) {
      setNewContent({
        title: post.title,
        content: post.content,
        tags: Object.keys(post.tags),
      });
      setRemovedTags([]);
      setErrors({});
      setTagInput('');
    }
  }, [isOpen]);

  const handleRemoveTag = (tagToRemove) => {
    setRemovedTags([...removedTags, tagToRemove]);
    setNewContent({
      ...newContent,
      tags: newContent.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddTag = () => {
    if (newContent.tags.includes(tagInput.trim().toLowerCase())) {
      return setErrors({
        ...errors,
        tags: `A tag with the name ${tagInput.trim()} already exists.`,
      });
    }

    if (
      tagInput.trim().length < MIN_TAG_LEN ||
      tagInput.trim().length > MAX_TAG_LEN
    ) {
      return setErrors({
        ...errors,
        tags: `Tag must be between ${MIN_TAG_LEN} and ${MAX_TAG_LEN} characters.`,
      });
    }

    if (newContent.tags.length >= MAX_TAG_NUM) {
      return setErrors({
        ...errors,
        tags: `Each post must have between ${MIN_TAG_NUM} and ${MAX_TAG_NUM} tags. Currently you have ${newContent.tags.length} tags.`,
      });
    }

    setErrors({
      ...errors,
      tags: null,
    });

    if (tagInput.trim() !== '') {
      setNewContent({
        ...newContent,
        tags: [...newContent.tags, tagInput.toLowerCase()],
      });
      setTagInput('');
    }
  };

  const handleEdit = (handle, newTitle, newPost, tags, removedTags) => {
    const errors = {};

    if (newTitle.length < MIN_TITLE_LEN || newTitle.length > MAX_TITLE_LEN) {
      errors.title = `Title must be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters.`;
    }

    if (newPost.length < MIN_CONTENT_LEN || newPost.length > MAX_CONTENT_LEN) {
      errors.content = `Content must be between ${MIN_CONTENT_LEN} and ${MAX_CONTENT_LEN} characters.`;
    }

    if (newContent.tags.length < MIN_TAG_NUM) {
      errors.tags = `Each post must have between ${MIN_TAG_NUM} and ${MAX_TAG_NUM} tags.
            Currently you have ${newContent.tags.length} tags.`;
    }

    if (Object.keys(errors).length > 0) {
      return setErrors(errors);
    }

    editPost(handle, newTitle, newPost);

    if (removedTags.length > 0) {
      removedTags.forEach((tag) => removeTag(handle, tag));
    }

    tags.forEach((tag) => {
      addTag(handle, tag);
    });

    setRemovedTags([]);
    onClose();
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit your post</ModalHeader>
        <ModalBody>
          <Stack>
            {(userData?.role === 'Admin' && userData?.uid === post.authorId) ||
              (userData?.role !== 'Admin' && (
                <FormControl isInvalid={errors.title}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={newContent.title}
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter post title"
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>
              ))}
            {(userData?.role === 'Admin' && userData?.uid === post.authorId) ||
              userData?.role !== 'Admin' && (
                <FormControl isInvalid={errors.content}>
                  <FormLabel>Post</FormLabel>
                  <Textarea
                    value={newContent.content}
                    resize="vertical"
                    minHeight="400px"
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        content: e.target.value,
                      })
                    }
                    placeholder="Enter post content"
                  />
                  <FormErrorMessage>{errors.content}</FormErrorMessage>
                </FormControl>
              )}
            <FormControl isInvalid={errors.tags}>
              <FormLabel>Tags</FormLabel>
              <VStack align="flex-start" spacing={1}>
                <Flex flexWrap="wrap" alignItems="flex-start" mt={4}>
                  {newContent.tags.map((tag) => (
                    <Tag m={1} key={tag}>
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                    </Tag>
                  ))}
                </Flex>
                <HStack mt={4} mb={4}>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tags"
                    h={8}
                    w={250}
                  />
                  <Button colorScheme="teal" h={8} onClick={handleAddTag}>
                    Add tag
                  </Button>
                </HStack>
              </VStack>
              <FormErrorMessage>{errors.tags}</FormErrorMessage>
            </FormControl>
            <HStack spacing={2} justifyContent="flex-end">
              <Button
                colorScheme="teal"
                onClick={() =>
                  handleEdit(
                    post.id,
                    newContent.title,
                    newContent.content,
                    newContent.tags,
                    removedTags
                  )
                }
              >
                Save
              </Button>
              <Button colorScheme="teal" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

EditPostModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  post: PropTypes.object,
};

export default EditPostModal;
