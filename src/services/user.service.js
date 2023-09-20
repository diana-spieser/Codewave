import { get, set, ref, query, orderByChild, equalTo, update, remove } from "firebase/database";
import { db } from "../config/firebase.config";

export const getUserByHandle = (handle) => {
    return get(ref(db, `users/${handle}`));
}

export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber, userName, role) => {
    return set(ref(db, `users/${handle}`), {
        uid,
        email,
        firstName,
        lastName,
        phoneNumber,
        userName,
        role,
        isBlocked: false,
        createdOn: Date.now()
    });
}

export const getUserData = (uid) => {
    return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
}

export const getActiveUsers = () => {
    return get(ref(db, 'users'));
}

export const updateUserPhone = (handle, newPhoneNumber) => {
    return update(ref(db, `users/${handle}`), {
     phoneNumber: newPhoneNumber,
 });
}

export const changeFirstName = (handle, newFirstName) => {
       return update(ref(db, `users/${handle}`), {
        firstName: newFirstName,
    });
}

export const changeLastName = (handle, newLastName) => {
    return update(ref(db, `users/${handle}`), {
     lastName: newLastName,
 });
}

export const updatePhotoUrl = (handle, newPhoto) => {
    return update(ref(db, `users/${handle}`), {
     photoUrl: newPhoto,
 });
}

export const editPost = (handle, newTitle, newContent) => {
    return update(ref(db, `posts/${handle}`), {
        title: newTitle,
        content: newContent,
    })
}

export const deletePost = async (handle) => {
    const postRef = ref(db, `posts/${handle}`);
    const postSnapshot = await get(postRef);

    if (postSnapshot.exists()) {
        const likedBy = postSnapshot.val().likedBy || {}; 
        for (const user in likedBy) {
            if (Object.hasOwnProperty.call(likedBy, user)) {
                deleteLikes(user, handle); 
            }
        }
        const comments = postSnapshot.val().comments || {}; 
        const commentIds = Object.keys(comments);
        for (const commentId of commentIds) {
            const commentRef = ref(db, `comments/${commentId}`);
            await remove(commentRef);
        }
        await remove(postRef);
    } 
}

export const deleteLikes = async (handle, postId) => {
    const likeRef = ref(db, `users/${handle}/likedPosts/${postId}`);
    const likeSnapshot = await get(likeRef);

    if (likeSnapshot.exists()) {
        await remove(likeRef);
    }
}   


export const blockUser = (handle, isBlocked) => {
    return update(ref(db, `users/${handle}`), {
     isBlocked: isBlocked,
 });
}

export const deleteUser = (handle) => {
    return remove(ref(db, `users/${handle}`));
};