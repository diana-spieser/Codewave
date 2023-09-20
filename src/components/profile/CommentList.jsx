import  { useState } from 'react';
import { Text, Box, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const CommentList = ({ comments }) => {
  const [sortOrder, setSortOrder] = useState('desc');

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === 'asc' ? a.content.localeCompare(b.content) : b.content.localeCompare(a.content)
  );

  return (
    <Box p="4">
      {sortedComments.length > 0 &&  <Text fontSize="xl" fontWeight="bold">
        Comments List:
      </Text>}
      {sortedComments.length > 0 && <Button onClick={toggleSortOrder} mt="2" colorScheme="teal">
        Toggle Sort Order ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>}

      {sortedComments.map((comment) => (
        <Box
          key={comment.id}
          p="4"
          borderWidth="1px"
          borderRadius="md"
          my="4"
        >
          <Text mt="2"> {comment.content}</Text>
        </Box>
      ))}
    </Box>
  );
};
CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
    })
  ),
};

export default CommentList;
