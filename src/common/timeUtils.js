const getTimeSincePost = (timestamp) => {
  const postDate = new Date(timestamp);
  const currentDate = new Date();
  const timeDifference = Math.floor((currentDate - postDate) / 1000); 

  if (timeDifference < 60) {
    return 'now';
  } else {
    const minutes = Math.floor(timeDifference / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return `${timeDifference} second${timeDifference === 1 ? '' : 's'} ago`;
    }
  }
};
export default getTimeSincePost;
