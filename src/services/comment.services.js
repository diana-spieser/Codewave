import { ref, push, get, remove, update } from 'firebase/database';
import { db } from '../config/firebase.config';

export const addComment = (
  content,
  authorId,
  postId,
  userName,
  photoUrl = null
) => {
  try {
    const commentRef = push(ref(db, 'comments'), {
      content,
      authorId,
      postId,
      userName,
      photoUrl,
      createdOn: Date.now(),
    });

    return update(ref(db, `posts/${postId}/comments`), {
      [commentRef.key]: true,
    })
      .then(() => {
        return update(ref(db, `comments/${commentRef.key}`), {
          postId,
        });
      })
      .then(() => getCommentById(commentRef.key));
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getCommentById = (id) => {
  return get(ref(db, `comments/${id}`)).then((result) => {
    if (!result.exists()) {
      throw new Error(`Comment with id ${id} does not exist!`);
    }
    const comment = result.val();
    comment.id = id;
    comment.createdOn = new Date(comment.createdOn);
    comment.post = comment.postId;
    comment.author = comment.authorId;

    return comment;
  });
};

export const getCommentsByPostId = (postId) => {
  return get(ref(db, 'comments'))
    .then((result) => {
      if (!result.exists()) {
        throw new Error('No comments exist!');
      }

      const commentsData = result.val();
      const commentsArray = Object.keys(commentsData)
        .filter((commentId) => commentsData[commentId].postId === postId)
        .map((commentId) => ({
          id: commentId,
          ...commentsData[commentId],
          createdOn: new Date(commentsData[commentId].createdOn),
        }));

      return commentsArray;
    })
    .catch((error) => {
      console.error('Error fetching comments:', error);
      throw error;
    });
};

export const deleteComment = (commentId, handle) => {
  let comment;

  return get(ref(db, `comments/${commentId}`))
    .then((commentSnapshot) => {
      comment = commentSnapshot.val();
      if (!commentSnapshot.exists()) {
        throw new Error(`Comment with id ${commentId} does not exist!`);
      }

      Object.keys(comment).forEach((likedBy) =>
        deleteLikesFromComments(handle, commentId)
      );

      update(ref(db, `posts/${comment.postId}/comments`), {
        [commentId]: null,
      });

      return remove(ref(db, `comments/${commentId}`));
    })
    .catch((error) => {
      console.error('Error deleting comment:', error);
    });
};

export const deleteLikesFromComments = async (handle, commentId) => {
  const likeRef = ref(db, `users/${handle}/likedComments/${commentId}`);
  const likeSnapshot = await get(likeRef);

  if (likeSnapshot.exists()) {
    await remove(likeRef);
  }
};

export const editComment = (commentId, newContent) => {
  let comment;

  return get(ref(db, `comments/${commentId}`))
    .then((commentSnapshot) => {
      comment = commentSnapshot.val();
      if (!comment) {
        throw new Error(`Comment with id ${commentId} does not exist!`);
      }

      // Update the comment content
      return update(ref(db, `comments/${commentId}`), {
        content: newContent,
      });
    })
    .catch((error) => {
      console.error('Error editing comment:', error);
      throw error;
    });
};

export const likeComment = (handle, commentId) => {
  const updateLikes = {};
  updateLikes[`/comments/${commentId}/likedBy/${handle}`] = true;
  updateLikes[`/users/${handle}/likedComments/${commentId}`] = true;

  return update(ref(db), updateLikes);
};

export const dislikeComment = (handle, commentId) => {
  const updateLikes = {};
  updateLikes[`/comments/${commentId}/likedBy/${handle}`] = null;
  updateLikes[`/users/${handle}/likedComments/${commentId}`] = null;

  return update(ref(db), updateLikes);
};
