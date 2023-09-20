import propTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { ROOT, ABOUT, POSTS, USERS, NEWS } from '../../common/Routes';
import NavItem from './NavItem';
import IMAGES from '../../assets/Images';
import CreatePostModal from '../posts/CreatePostModal';
import { useContext } from 'react';
import { AuthContext } from '../../context/authentication-context';
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiInfo,
  FiUsers,
} from 'react-icons/fi';

const LinkItems = [
  { name: 'Home', icon: FiHome, link: ROOT },
  { name: 'Posts', icon: FiCompass, link: POSTS },
  { name: 'News', icon: FiTrendingUp, link: NEWS },
  { name: 'Users', icon: FiUsers, link: USERS },
  { name: 'About', icon: FiInfo, link: ABOUT },
];

const SidebarContent = ({ onClose, ...rest }) => {
  const { user, userData } = useContext(AuthContext);
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          <RouterLink to={ROOT}>
            <img src={IMAGES.logo} alt="logo" />
          </RouterLink>
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        link.name === 'Users' && userData && userData.role === 'Admin' ?
          <NavItem
            key={link.name}
            icon={link.icon}
            link={link.link}
          >
            {link.name}
          </NavItem> :
          (link.name !== 'Users' && <NavItem
            key={link.name}
            icon={link.icon}
            link={link.link}
          >
            {link.name}
          </NavItem>)
      ))}

      {user !== null && <CreatePostModal />}
    </Box>
  );
};

export default SidebarContent;

SidebarContent.propTypes = {
  onClose: propTypes.func,
};
