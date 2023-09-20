import {
  Button,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Select,
  useToast,
  Box,
  Heading,
  FormErrorMessage,
  VStack,
  Tag,
  HStack,
  TagLabel,
  TagCloseButton,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { get, ref } from 'firebase/database';
import { addPost, addTag } from '../../services/post.services';
import { db } from '../../config/firebase.config';
import { AuthContext } from '../../context/authentication-context';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { POST } from '../../common/Routes';
import { MIN_TITLE_LEN, MAX_TITLE_LEN, MIN_CONTENT_LEN, MAX_CONTENT_LEN, MIN_TAG_LEN, MAX_TAG_LEN, MIN_TAG_NUM, MAX_TAG_NUM } from '../../common/Common';

const CreatePost = (props) => {
  const { user, userData } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const categoriesRef = ref(db, 'categories');
    get(categoriesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const categoriesData = snapshot.val();
        setCategories(Object.keys(categoriesData));
      }
    });
  }, []);

  const handleAddTag = () => {
    if (tags.includes(tagInput.trim().toLowerCase())) {
      return setErrors({
        ...errors,
        tags: `A tag with the name ${tagInput.trim()} already exists.`
      });
    }

    if (tagInput.trim().length < MIN_TAG_LEN || tagInput.trim().length > MAX_TAG_LEN) {
      return setErrors({
        ...errors,
        tags: `Tag must be between ${MIN_TAG_LEN} and ${MAX_TAG_LEN} characters.`
      });
    }

    if (tags.length >= MAX_TAG_NUM) {
      return setErrors({
        ...errors,
        tags: `Each post must have between ${MIN_TAG_NUM} and ${MAX_TAG_NUM} tags. Currently you have ${tags.length} tags.`
      });
    }
   
    setErrors({
      ...errors,
      tags: null
    })

    setTags([...tags, tagInput.trim().toLowerCase()]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTitleBlur = () => {
    if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN) {
      setErrors({
        ...errors,
        title: `Title must be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters.`,
      });
    } else {
      setErrors({
        ...errors,
        title: null,
      });
    }
  };

  const handleContentBlur = () => {
    if (content.length < MIN_CONTENT_LEN || content.length > MAX_CONTENT_LEN) {
      setErrors({
        ...errors,
        content: `Content must be between ${MIN_CONTENT_LEN} and ${MAX_CONTENT_LEN} characters.`,
      });
    } else {
      setErrors({
        ...errors,
        content: null,
      });
    }
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN) {
      errors.title = `Title must be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters.`;
    }

    if (content.length < MIN_CONTENT_LEN || content.length > MAX_CONTENT_LEN) {
      errors.content = `Content must be between ${MIN_CONTENT_LEN} and ${MAX_CONTENT_LEN} characters.`;
    }

    if (tags.length < MIN_TAG_NUM) {
      errors.tags = `Each post must have between ${MIN_TAG_NUM} and ${MAX_TAG_NUM} tags.
        Currently you have ${tags.length} tags.`
    }

    if (Object.keys(errors).length > 0) {
      return setErrors(errors);
    }

    setErrors({});
    props.onClose();

      const { uid } = user;

      addPost(title, content, uid, userData.userName, userData.photoUrl, selectedCategory, {})
        .then((post) => {
          setTitle('');
          setContent('');
          tags.forEach(tag => addTag(post.id, tag));
          toast({
            title: 'Post created successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          navigate(POST.replace(':postId', post.id));
        })
        .catch((error) => {
          console.error('Error creating post:', error);
          toast({
            title: 'Error creating post',
            description: 'An error occurred while creating the post.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
  };

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      p={6}
      m="10px auto"
      as="form"
      onSubmit={handleSubmit}
    >
      <Heading w="100%" textAlign="center" fontWeight="normal">
        Create Post
      </Heading>
      <FormControl
        id="title"
        isRequired
        mt="2%"
        isInvalid={errors.title}
      >
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl
        id="content"
        isRequired
        mt="2%"
        isInvalid={errors.content}
      >
        <FormLabel>Content</FormLabel>
        <Textarea
          placeholder="Enter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleContentBlur}
        />
        <FormErrorMessage>{errors.content}</FormErrorMessage>
      </FormControl>
      <FormControl
        id="category"
        isRequired
        mt="2%"
      >
        <FormLabel>Category</FormLabel>
        <Select
          placeholder="Select category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl
        id="tagsField"
        mt="2%"
        isInvalid={errors.tags}
      >
        <FormLabel>Tags</FormLabel>
        <VStack align="flex-start" spacing={1} mt={4}>
          <Flex flexWrap="wrap" alignItems="flex-start" mt={4}>
            {tags.map(tag => (
              <Tag key={tag} m={1}>
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
              </Tag>
            ))}
          </Flex>
          <HStack mt={4}>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter tags"
              h={8}
              w={250}
            />
            <Button bg="blue" h={8} onClick={handleAddTag}>
              Add tag
            </Button>
          </HStack>
          <FormErrorMessage>{errors.tags}</FormErrorMessage>
        </VStack>
      </FormControl>
      <Button mt={4} bg="blue" type="submit">
        Create Post
      </Button>      
    </Box>
  );
};

CreatePost.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreatePost;
