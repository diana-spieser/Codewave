import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { searchPosts, searchUsers } from '../services/search.services';
import PostsSearchResults from '../components/search/PostsSearchResults';
import UsersSearchResults from '../components/search/UsersSearchResults';

function Search() {
  const [ result, setResult ] = useState('posts');
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');

  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
  });

  useEffect(() => {
    if (searchQuery) {
      Promise.all([searchPosts(searchQuery), searchUsers(searchQuery)])
        .then(([postResults, userResults]) => {
          setSearchResults({ posts: postResults, users: userResults });
        })
        .catch((error) => {
          console.error('Error encountered:', error);
        });
    }
  }, [searchQuery]);

  return (
    <>
      <Button mr={1}
        bg={result === 'posts' ? 'blue' : 'transparent'}
        onClick={() => setResult('posts')}
        variant={'outline'}
      >
        Posts: {searchResults.posts.length}
      </Button>
      <Button
        onClick={() => setResult('users')}
        bg={result === 'users' ? 'blue' : 'transparent'}
        variant={'outline'}
      >
        Users: {searchResults.users.length}
      </Button>
      {result === 'users' && <UsersSearchResults users={searchResults.users} />}
      {result === 'posts' && <PostsSearchResults
        searchQuery={searchQuery}
        searchResults={searchResults.posts}
      />}
    </>
  );
}

export default Search;
