import UserCard from "./CardSearchResult";
import { Text } from "@chakra-ui/react";
import { Grid} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function UsersSearchResults({users}) {
  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: '1fr 1fr',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      gap={6}
      py={6}
    >
      {users.length > 0 ? users.map((user) => (
        <UserCard
          key={user.uid}
          avatarSrc={user.photoUrl}
          name={user.userName}
          role={user.role}
          isBlocked={user.isBlocked}
          uid={user.uid}
        />
      )) : <Text>No users found</Text>}
    </Grid>
  );
}

UsersSearchResults.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.string,
    userName: PropTypes.string,
    photoUrl: PropTypes.string,
    role: PropTypes.string,
    isBlocked: PropTypes.bool,
  })),
};
export default UsersSearchResults;
