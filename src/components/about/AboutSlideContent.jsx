import { Box, Text, Slide, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const AboutSlideContent = ({ isOpen, onToggle }) => {
  return (
    <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
      <Box p="40px" color="white" bg="blue" mt="4" rounded="md" shadow="md">
        <Text mt="4" textAlign="center">
          We provide a space for developers to connect, share knowledge, ask
          questions, and collaborate on JavaScript projects. Whether you are a
          beginner, intermediate, or advanced JavaScript developer, our forum is
          the place to discuss the latest trends, frameworks, libraries, and
          best practices in the world of JavaScript.
        </Text>
        <Button onClick={onToggle} mt="4" colorScheme="yellow" size="sm">
          Close
        </Button>
      </Box>
    </Slide>
  );
};

AboutSlideContent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
export default AboutSlideContent;
