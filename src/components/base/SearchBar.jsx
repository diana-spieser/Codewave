import  { useState } from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <InputGroup maxW="600px">
      <Input
        placeholder="Search for posts or users"
        borderColor={'blue'}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={handleKeyPress}
      />
      <InputRightElement width="4rem">
        <Button
          h="full"
          size="sm"
          color={'white'}
          bg="blue"
          _hover={{ bg: 'yellow', color: 'black' }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
};

export default SearchBar;
