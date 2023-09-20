import { ref, push, get, update } from 'firebase/database';
import { db } from '../config/firebase.config';

const fromPostsDocument = (snapshot) => {
  const postsDocument = snapshot.val();

  return Object.keys(postsDocument).map((key) => {
    const post = postsDocument[key];

    return {
      ...post,
      id: key,
      createdOn: new Date(post.createdOn),
      likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    };
  });
};

export const addPost = (
  title,
  content,
  authorId,
  userName,
  photoUrl = '',
  categoryId,
  comments
) => {
  try {
    const postRef = push(ref(db, 'posts'), {
      title,
      content,
      authorId,
      userName,
      photoUrl,
      categoryId,
      comments: comments || {},
      createdOn: Date.now(),
    });

    return getPostById(postRef.key);
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

export const getPostById = (id) => {
  return get(ref(db, `posts/${id}`)).then((result) => {
    if (!result.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    const post = result.val();
    post.id = id;
    post.createdOn = new Date(post.createdOn);
    post.category = post.categoryId;
    if (!post.likedBy) post.likedBy = [];
    if (!post.comments) post.comments = [];
    if (!post.tags) post.tags = {};

    return post;
  });
};

export const getAllPosts = () => {
  return get(ref(db, 'posts')).then(fromPostsDocument);
};
export const getAllPostsFromUser = (authorId) => {
  const postsRef = ref(db, 'posts');
  return get(postsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const postsData = snapshot.val();
       
        const postsArray = Object.entries(postsData).map(
          ([postId, postData]) => ({
            id: postId,
            ...postData,
          })
        );

        
        if (authorId) {
          return postsArray.filter((post) => post.authorId === authorId);
        } else {
          return postsArray;
        }
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return [];
    });
};

export const getAllCommentsFromUser = (authorId) => {
  const postsRef = ref(db, 'comments');
  return get(postsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const postsData = snapshot.val();
       
        const postsArray = Object.entries(postsData).map(
          ([postId, postData]) => ({
            id: postId,
            ...postData,
          })
        );

        
        if (authorId) {
          return postsArray.filter((post) => post.authorId === authorId);
        } else {
          return postsArray;
        }
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return [];
    });
};

export const getUserByUid = (userId) => {
  const userRef = ref(db, `users/${userId}`);
  return get(userRef)
    .then((userSnapshot) => {
      if (userSnapshot.exists()) {
        return userSnapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error getting user', error);
      return null;
    });
};

export const getNumberOfPosts = () => {
  return get(ref(db, 'posts'));
};


export const likePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

  return update(ref(db), updateLikes);
};

export const dislikePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

  return update(ref(db), updateLikes);
};

export const getLikedPosts = (handle) => {

  return get(ref(db, `users/${handle}`))
    .then(snapshot => {
      if (!snapshot.val()) {
        throw new Error(`User with handle @${handle} does not exist!`);
      }

      const user = snapshot.val();
      if (!user.likedPosts) return [];

      return Promise.all(Object.keys(user.likedPosts).map(key => {

        return get(ref(db, `posts/${key}`))
          .then(snapshot => {
            const post = snapshot.val();

            return {
              ...post,
              createdOn: new Date(post.createdOn),
              id: key,
              likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
            };
          });
      }));
    });
};

export const addTag = (postId, tag) => {
  const updateTags = {};
  updateTags[`/posts/${postId}/tags/${tag}`] = true;

  return update(ref(db), updateTags);
};

export const removeTag = (postId, tag) => {
  const updateTags = {};
  updateTags[`/posts/${postId}/tags/${tag}`] = null;

  return update(ref(db), updateTags);
};
