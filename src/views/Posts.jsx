import AllPosts from '../components/posts/AllPosts';
import PageHeader from '../components/base/PageHeader';
import CustomStatGroup from '../components/base/CustomStatsGroup';
import useStats from '../hooks/useStats';
import { Flex, VStack } from '@chakra-ui/react';

function Posts() {
  const { activeUsers, numberOfPosts, avatarSrc } = useStats();

  return (
    <>
      {/* Desktop layout */}
      <Flex
        justifyContent="space-around"
        display={{ base: 'none', md: 'flex' }}
      >
        <PageHeader />
        <Flex justifyContent="inline-block">
          <CustomStatGroup
            numberOfPosts={numberOfPosts}
            activeUsers={activeUsers}
            avatarSrc={avatarSrc}
          />
        </Flex>
      </Flex>


      {/* Mobile layout */}
      <VStack
        justifyContent="center"
        alignItems="center"
        display={{ base: 'flex', md: 'none' }}
      >
        <PageHeader />
      </VStack>
        <AllPosts />
    </>
  );
}

export default Posts;
