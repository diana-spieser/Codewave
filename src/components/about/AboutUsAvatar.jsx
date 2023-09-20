
import { useColorModeValue, Flex, Stack, Text, Avatar } from "@chakra-ui/react";
import PropTypes from 'prop-types';

export const AboutUsAvatar = ({ src, name, title }) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} size='2xl' />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

AboutUsAvatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
};
