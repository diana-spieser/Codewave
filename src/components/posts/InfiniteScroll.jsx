import { useState, useEffect, useCallback } from 'react';
 function UseInfiniteScroll  (initialVisiblePosts, postsPerLoad, postsArray) {
  const [visiblePosts, setVisiblePosts] = useState(initialVisiblePosts);

  const loadMorePosts = useCallback(() => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + postsPerLoad);
  }, [postsPerLoad]);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (isBottom) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMorePosts]);

  const visiblePostsArray = postsArray.slice(0, visiblePosts);

  return { visiblePostsArray, loadMorePosts };
}

export default UseInfiniteScroll;
