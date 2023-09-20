
import {
  Box,
  Avatar,
  Flex,
  Heading,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/authentication-context';
import { blockUser } from '../../services/user.service';
import { getUserByHandle } from '../../services/user.service';
import AuthorModal from '../profile/AuthorModal';
import PropTypes from 'prop-types';
import ConfirmationAlert from '../base/ConfirmationAlert';

const UserCard = ({ avatarSrc, name, role, isBlocked, uid }) => {
  const { userData } = useContext(AuthContext);
  const [isTrue, setIsTrue] = useState(!isBlocked);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    getUserByHandle(name)
      .then(snapshot => snapshot.exists() ? setIsTrue(!snapshot.val()?.isBlocked) : null)
      .catch(e => console.error(e));
  }, [isTrue]);

  const handleBlockUser = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmBlock = () => {
    setIsTrue(prevState => !prevState);
    blockUser(name, isTrue);
    setIsConfirmationOpen(false);
  };

  const handleCancelBlock = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <Box
      maxW={'370px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'md'}
      overflow={'hidden'}
    >
      <Flex justifyContent={'space-around'}>
        <Flex
          align="center"
          p={6}
          flexDirection={'column'}
          justifyContent={'inherit'}
        >
          <Avatar
            size={'xl'}
            src={avatarSrc}
            css={{
              border: '2px solid white',
            }}
          />
          <Heading
            fontSize={'xl'}
            fontWeight={500}
            width={'full'}
            m={4}
            textAlign={'center'}
          >
            {name}
          </Heading>
        </Flex>
        <Flex alignItems={'center'} justifyContent={'space-evenly'} flexDirection={'column'}>

            {isAuthorModalOpen && (
              <AuthorModal
                authorName={name}
                authorPhoto={avatarSrc}
                authorIdent={uid}
                onClose={() => setIsAuthorModalOpen(false)}
              />
            )}
            {userData?.role === 'Admin' && role === 'User' && (
              <Button
                onClick={handleBlockUser}
               > 
                {isTrue ? 'Block' : 'Unblock'}
              </Button>
            )}
          </Flex>
        </Flex>
        <ConfirmationAlert
        isOpen={isConfirmationOpen}
        onClose={handleCancelBlock}
        onDelete={handleConfirmBlock}
        message={`Are you sure you want to ${isTrue ? 'block' : 'unblock'} this user?`}
      />
    </Box>
  );
};

UserCard.propTypes = {
  avatarSrc: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  isBlocked: PropTypes.bool,
  uid: PropTypes.string,
};
export default UserCard;
