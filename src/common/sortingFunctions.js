export const sortPostsByDate = (posts) => {
  return [...posts].sort(
    (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
  );
};


export const sortPostsByComments = (posts) => {
  const sortedPosts = posts.slice().sort((a, b) => {
    const numCommentsA = a.comments ? Object.keys(a.comments).length : 0;
    const numCommentsB = b.comments ? Object.keys(b.comments).length : 0;
    return numCommentsB - numCommentsA;
  });
  
  return sortedPosts;
};
