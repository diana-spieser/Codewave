import { get, ref } from "firebase/database";
import { db } from "../config/firebase.config";

export const searchPosts = (searchQuery) => {
  return get(ref(db, 'posts')).then((snapshot) => {
    const posts = [];
    snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();
      if (
        post.title &&
        (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.keys(post.tags).includes(searchQuery.toLowerCase()))
        ) {
        posts.push({ id: childSnapshot.key, ...post });
      }
    });
    return posts;
  });
};

export const searchUsers = (searchQuery) => {
  return get(ref(db, 'users')).then((snapshot) => {
    const users = [];
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (user.userName &&
        (user.userName.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()))) {
        users.push(user);
      }
    });
    return users;
  });
};
