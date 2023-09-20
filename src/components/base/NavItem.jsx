import propTypes from 'prop-types';
import {
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation} from 'react-router-dom';


function NavItem ({ icon, children, link, ...rest }) {
  const location = useLocation();
  const isActive = location.pathname === link;
  return (
    <Box
      as={RouterLink}
      to={link}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'blue' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
}

export default NavItem;

NavItem.propTypes = {
  icon: propTypes.elementType,
  children: propTypes.string,
  link: propTypes.string,
};
