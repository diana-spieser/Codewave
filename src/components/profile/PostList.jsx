import { useState } from 'react';
import { Text, Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PostList = ({ posts, likedPosts }) => {
  const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const extractUniqueCategories = (posts) => {
    const categories = new Set();
    posts.forEach((post) => {
      categories.has(post.categoryId) ? null : categories.add(post.categoryId);
    });
    return Array.from(categories);
  };

  const handleCategorySelect = (categoryId) => {
    if(categoryId !== 'liked') {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    } else {
      setSelectedCategory('liked');
    }
  };

  const uniqueCategories = extractUniqueCategories(posts);

  const sortFunction = (array) =>
    array.sort((a, b) =>
      sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

  const sortedPosts = sortFunction([...posts]);
  const sortedLikedPosts = sortFunction([...likedPosts]);

  const filteredPosts = selectedCategory
    ? sortedPosts.filter((post) => post.categoryId === selectedCategory)
    : sortedPosts;

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Box p="4">
      {sortedPosts.length > 0 && (
        <Text fontSize="xl" fontWeight="bold">
          Posts List
        </Text>
      )}
      {sortedPosts.length > 0 && (
        <Button onClick={toggleSortOrder} mt="2" colorScheme="teal">
          Toggle Sort Order ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </Button>
      )}
      {sortedPosts.length > 0 && (
        <Box mt="2">
          <Text mb="2">Filter by Category:</Text>
          <Button
            key={'All'}
            onClick={() => handleCategorySelect(null)}
            variant={selectedCategory === null ? 'solid' : 'outline'}
            ml="2"
          >
            All
          </Button>
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategorySelect(category)}
              variant={selectedCategory === category ? 'solid' : 'outline'}
              ml="2"
            >
              {category}
            </Button>
          ))}
          {likedPosts.length > 0 && <Button
            key={'likedPosts'}
            onClick={() => handleCategorySelect('liked')}
            variant={selectedCategory === 'liked' ? 'solid' : 'outline'}
            ml="4"
          >
            Liked Posts
          </Button>}
        </Box>
      )}

      {selectedCategory !== 'liked' && filteredPosts.map((post) => (
        <Box
          key={post.id}
          p="4"
          borderWidth="1px"
          borderRadius="md"
          my="4"
          cursor="pointer"
          _hover={{ shadow: 'md' }}
        >
          <Text fontSize="lg" fontWeight="bold" onClick={() => handlePostClick(post.id)}>
            Title: {post.title}
          </Text>
          <Text mt="2">Content: {post.content}</Text>
        </Box>
      ))}
      {selectedCategory === 'liked' && likedPosts.length > 0 && sortedLikedPosts.map((post) => (
        <Box
          key={post.id}
          p="4"
          borderWidth="1px"
          borderRadius="md"
          my="4"
          cursor="pointer"
          _hover={{ shadow: 'md' }}
        >
          <Text fontSize="lg" fontWeight="bold" onClick={() => handlePostClick(post.id)}>
            Title: {post.title}
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            Author: {post.userName}
          </Text>
          <Text mt="2">Content: {post.content}</Text>
        </Box>
      ))}

    </Box>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
    })
  ),
  likedPosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
    })
  ),
};

export default PostList;
