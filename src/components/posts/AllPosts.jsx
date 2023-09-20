import { useState, useEffect } from 'react';
import { VStack, Wrap, WrapItem, Flex } from '@chakra-ui/react';
import { PostFilter } from './PostChakraComponents';
import useInfiniteScroll from './infiniteScroll';
import PostTable from './PostTable';
import { getAllPosts } from '../../services/post.services.js';
import { sortPostsByDate } from '../../common/sortingFunctions';
import { useParams } from 'react-router-dom';

const AllPosts = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'All');
  const [filterOptions, setFilterOptions] = useState(['All']);

  useEffect(() => {
    getAllPosts()
      .then((data) => {
        setPosts(data);
        const uniqueCategoryIds = [
          ...new Set(data.map((post) => post.categoryId)),
        ];
        const orderedCategoryOptions = [
          'All',
          ...uniqueCategoryIds
            .filter((category) => !['All'].includes(category))
            .sort(),
        ];
        setFilterOptions(orderedCategoryOptions);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, [posts]);

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  const { visiblePostsArray } = useInfiniteScroll(10, 5, posts);

  return (
    <VStack py={8} maxW="100%" alignItems="stretch">
      <Flex direction={{ base: 'row', md: 'column' }} align="center">
        <Wrap justify="left" w="100%" overflow="hidden">
          <WrapItem>
            <PostFilter
              options={filterOptions}
              selectedCategory={selectedCategory}
              onChange={(value) => {
                if (value === 'All') {
                  setPosts(sortPostsByDate(posts));
                  setSelectedCategory('All');
                } else {
                  handleChangeCategory(value);
                }
              }}
              fontSize={{ base: 'sm', md: '2xs' }}
              size={{ base: 'sm', md: '2' }}
            />
          </WrapItem>
        </Wrap>
      </Flex>
      <PostTable
        posts={visiblePostsArray.filter((post) => {
          if (selectedCategory === 'All') {
            return true;
          } else {
            return post.categoryId === selectedCategory;
          }
        })}
      />
    </VStack>
  );
};

export default AllPosts;
