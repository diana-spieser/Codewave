import useStats from '../hooks/useStats';
import { Flex } from '@chakra-ui/react';
import PageHeader from '../components/base/PageHeader';
import UsersList from '../components/users/UsersList';
import CustomStatGroup from '../components/base/customStatsGroup';

function Users() {
  const { activeUsers, numberOfPosts, avatarSrc } = useStats();
  const headerText = 'ALL USERS ON CODE WAVE';
  const accompanyingText = 'The place to share about your coding journey';
  return (
    <>
      <Flex justifyContent={'space-around'}>
        <PageHeader
          headerText={headerText}
          accompanyingText={accompanyingText}
        />
        <Flex justifyContent={'inline-block'}>
          <CustomStatGroup
            numberOfPosts={numberOfPosts}
            activeUsers={activeUsers}
            avatarSrc={avatarSrc}
          />
        </Flex>
      </Flex>
          <UsersList />
    </>
  );
}

export default Users;
