
import { useState, useEffect } from 'react';
import { getActiveUsers } from '../services/user.service';
import { getNumberOfPosts } from '../services/post.services';

export default function useStats() {
  const [activeUsers, setActiveUsers] = useState();
  const [numberOfPosts, setNumberOfPosts] = useState();
  const [avatarSrc, setAvatarSrc] = useState([]);

  useEffect(() => {
    getActiveUsers()
      .then((snapshot) => {
      const usersData = snapshot.val();
      setActiveUsers(Object.keys(usersData).length);

      const usersArray = Object.values(usersData);
      const filteredUsers = usersArray.filter((user) => user.photoUrl);
      const avatarUrls = filteredUsers.map((user) => user.photoUrl);
      setAvatarSrc(avatarUrls);
      })
      .catch((e) => console.error(e));

    getNumberOfPosts()
      .then((snapshot) =>
        snapshot.exists()
          ? setNumberOfPosts(Object.keys(snapshot.val()).length)
          : null
      )
      .catch((e) => console.error(e));
  }, []);

  return { activeUsers, numberOfPosts, avatarSrc };
}
