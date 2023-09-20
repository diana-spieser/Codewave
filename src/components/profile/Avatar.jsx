import PropTypes from 'prop-types';
import { Box, Image } from '@chakra-ui/react';

const Avatar = ({ imageUrl }) => {
  return (
    <Box maxW="400px" m="auto">
      <Image src={imageUrl} alt="Uploaded" />
    </Box>
  );
};

Avatar.propTypes = {
  imageUrl: PropTypes.string,
};
export default Avatar;
