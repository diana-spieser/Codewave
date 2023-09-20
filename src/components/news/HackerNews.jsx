import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Divider,
  Wrap,
  WrapItem,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';



const HackerNewsArticles = ({ numArticles }) => {
  const [topStories, setTopStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchTopStories(numArticles)
      .then((stories) => {
        setTopStories(stories);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching top stories:', error);
        setIsLoading(false);
      });
  }, [numArticles]);

  // Fetch the top stories from the Hacker News API
  function fetchTopStories(num) {
    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then((response) => response.json())
      .then((storyIds) => {
        const topStoryIds = storyIds.slice(0, num);

        const storyPromises = topStoryIds.map((storyId) => {
          return fetch(
            `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
          )
            .then((storyResponse) => storyResponse.json())
            .catch((error) => {
              console.error('Error fetching story:', error);
              return null;
            });
        });

        return Promise.all(storyPromises);
      })
      .then((stories) => {
        const validStories = stories.filter((story) => story !== null);
        return validStories;
      })
      .catch((error) => {
        console.error('Error fetching top stories:', error);
        return [];
      });
  }

  return (
    <VStack spacing={6} alignItems="flex-start" p={12}>
      <Heading as="h2" color={'blue'}>
        Hacker News Top Stories
      </Heading>
      <Divider />
      {isLoading ? (
        <Spinner size="xl" margin={'auto'} mt={4} />
      ) : (
        <Wrap spacing="30px" width="100%">
          {topStories.map((story, index) => (
            <WrapItem
              key={index}
              width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}
            >
              <Box w="100%">
                <Heading fontSize="xl" marginTop="2">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: hoveredLinkIndex === index ? '#FFED00' : '',
                      textDecoration: 'none',
                      transition: 'color 0.3s', // Add smooth transition
                    }}
                    onMouseOver={() => setHoveredLinkIndex(index)}
                    onMouseOut={() => setHoveredLinkIndex(null)}
                  >
                    {story.title}
                  </a>
                </Heading>
                <Text as="p" fontSize="md" marginTop="2">
                  By {story.by} |{' '}
                  {new Date(story.time * 1000).toLocaleDateString()}
                </Text>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  );
};
 HackerNewsArticles.propTypes = {
  numArticles: PropTypes.number,
};

export default HackerNewsArticles;
