import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
export const Container = ({ children }) => {
  return <Box minH="100vh">{children}</Box>;
};

export const MainContent = ({ children }) => {
  return (
    <Box ml={{ base: 0, md: 60 }} p="4">
      {children}
    </Box>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};
