import { Heading, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function PageHeader({
  headerText = 'CODE WAVE COMMUNITY',
  accompanyingText = 'The place to share about your coding journey',
}) {
  return (
    <VStack spacing={4} align="center" p={4}>
      <Heading
        as="h1"
        size="xl"
        bgGradient="linear(to-l, #7928CA, #0F6292)"
        bgClip="text"
        fontSize={{ base: 'xl', md: '6xl' }}
        fontWeight="extrabold"
        textAlign="center"
        noOfLines={1}
      >
        {headerText}
      </Heading>
      <Text fontSize={{ base: 'md', md: 'md' }} textAlign="center">
        {accompanyingText}
      </Text>
    </VStack>
  );
}

PageHeader.propTypes = {
  headerText: PropTypes.string,
  accompanyingText: PropTypes.string,
};

export default PageHeader;
