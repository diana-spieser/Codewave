import propTypes from 'prop-types';
import { useColorMode } from '@chakra-ui/react';
import IMAGES from '../../assets/Images';
import { LOGIN, REGISTER, PROFILE, ROOT } from '../../common/Routes';
import { Link as RouterLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
 useMediaQuery,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../../context/authentication-context';
import { logoutUser } from '../../services/auth.services';
import { useNavigate } from 'react-router-dom';
import { searchPosts, searchUsers } from '../../services/search.services.js';


function MobileNav({ onOpen, ...rest }) {

  const { user, userData } = useContext(AuthContext);
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const { colorMode, toggleColorMode } = useColorMode();

  const navigate = useNavigate();

  const handleSearch = (query) => {
    Promise.all([searchPosts(query), searchUsers(query)])
    .then(([postResults, userResults]) => {
      const searchResults = { posts: postResults, users: userResults };
      navigate(`/search?query=${query}`, { state: { searchResults } });
    })
    .catch((error) => {
      console.error('Error encountered:', error);
    });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      {isMobile ? null : (
      <Flex alignItems="center">
        <Switch
          id="color-mode-switch"
          size="md"
          style={{ '--switch-bg': 'red' }}
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
        />
        <Text ml="2">Color Mode</Text>
      </Flex>  ) }

      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
      {isMobile ? null : <img src={IMAGES.logo} alt="logo" />}
      </Text>
      <Flex px="4" align="center" justify={'center'} flex="1">
        <SearchBar onSearch={handleSearch} />
      </Flex>
      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              {userData ? (
                <HStack>
                  <Avatar size={'sm'} src={`${userData.photoUrl}`} />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{userData.userName}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {userData.role}
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              ) : (
                <Avatar size={'sm'} src={''} />
              )}
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              {user !== null ? (
                <MenuItem as={RouterLink} to={PROFILE}>
                  Profile
                </MenuItem>
              ) : (
                <MenuItem as={RouterLink} to={LOGIN}>
                  Log in
                </MenuItem>
              )}
              {user !== null ? (
                <MenuItem as={RouterLink} to={ROOT} onClick={logoutUser}>
                  Log out
                </MenuItem>
              ) : (
                <MenuItem as={RouterLink} to={REGISTER}>
                  Sign Up
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}

export default MobileNav;
MobileNav.propTypes = {
  onOpen: propTypes.func,
};
