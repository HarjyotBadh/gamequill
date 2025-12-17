import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  orderBy,
  limit,
} from "firebase/firestore";

const userCache = new Map();
const USER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedUser(uid) {
  const cacheKey = uid.toString();
  const cached = userCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < USER_CACHE_TTL) {
    return cached.data;
  }

  const userRef = doc(db, "profileData", cacheKey);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    userCache.set(cacheKey, { data: userData, timestamp: Date.now() });
    return userData;
  }

  return null;
}

async function batchGetUsers(uids) {
  const uniqueUids = [...new Set(uids.filter(Boolean))];
  const results = {};
  const toFetch = [];

  for (const uid of uniqueUids) {
    const cached = userCache.get(uid.toString());
    if (cached && Date.now() - cached.timestamp < USER_CACHE_TTL) {
      results[uid] = cached.data;
    } else {
      toFetch.push(uid);
    }
  }

  const fetchPromises = toFetch.map(async (uid) => {
    const userRef = doc(db, "profileData", uid.toString());
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userCache.set(uid.toString(), { data: userData, timestamp: Date.now() });
      results[uid] = userData;
    }
  });

  await Promise.all(fetchPromises);
  return results;
}

export async function fetchReviewsByGameId(game_id) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("gameID", "==", game_id)
  );
  const querySnapshot = await getDocs(reviewsQuery);

  const uids = querySnapshot.docs.map((doc) => doc.data().uid?.toString());
  const usersData = await batchGetUsers(uids);

  const fetchedReviews = querySnapshot.docs.map((document) => {
    const data = document.data();
    const userData = usersData[data.uid] || {};
    return {
      id: document.id,
      username: userData.username || "Unknown User",
      profilePicture: userData.profilePicture || null,
      ...data,
    };
  });

  fetchedReviews.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  return fetchedReviews;
}

export async function fetchAverageRating(game_id) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("gameID", "==", game_id)
  );
  const querySnapshot = await getDocs(reviewsQuery);

  if (querySnapshot.empty) {
    return null;
  }

  let totalRating = 0;
  let count = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.rating) {
      totalRating += data.rating;
      count++;
    }
  });

  if (count === 0) return null;
  return Math.round((totalRating / count) * 10) / 10;
}

export async function fetchReviewById(review_id) {
  const reviewRef = doc(db, "reviews", review_id);
  const reviewDoc = await getDoc(reviewRef);
  if (!reviewDoc.exists()) {
    throw new Error(`No review found for ID: ${review_id}`);
  }
  const reviewData = reviewDoc.data();

  const userData = await getCachedUser(reviewData.uid);
  if (!userData) {
    throw new Error(`No user found for UID: ${reviewData.uid}`);
  }

  return {
    id: reviewDoc.id,
    username: userData.username,
    profilePicture: userData.profilePicture,
    ...reviewData,
  };
}

export async function fetchFriendsRecentReviews(numReviews, currentUserId) {
  if (!currentUserId) {
    console.error("No current user ID provided");
    return [];
  }

  const userData = await getCachedUser(currentUserId);
  if (!userData) {
    throw new Error(`No user found for UID: ${currentUserId}`);
  }
  const followersList = userData.follows;

  if (!followersList || followersList.length === 0 || followersList[0] === "") {
    return [];
  }

  const reviewPromises = followersList.map(async (uid) => {
    let reviewsQuery = query(
      collection(db, "reviews"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc")
    );

    if (numReviews !== -1) {
      reviewsQuery = query(reviewsQuery, limit(numReviews));
    }

    const reviewDocs = await getDocs(reviewsQuery);
    return reviewDocs.docs.map((doc) => ({ uid, ...doc.data(), id: doc.id }));
  });

  const reviewsByUser = await Promise.all(reviewPromises);
  const allReviewsRaw = reviewsByUser.flat();

  const uids = [...new Set(allReviewsRaw.map((r) => r.uid))];
  const usersData = await batchGetUsers(uids);

  const allReviews = allReviewsRaw.map((review) => {
    const user = usersData[review.uid] || {};
    return {
      ...review,
      username: user.username,
      profilePicture: user.profilePicture,
    };
  });

  allReviews.sort((a, b) => b.timestamp - a.timestamp);

  if (numReviews !== -1) {
    return allReviews.slice(0, numReviews);
  }
  return allReviews;
}

export async function fetchUserRecentReviews(num, uid) {
  let review_list = [];
  let reviewIds = new Set();

  let reviewsQuery = query(
    collection(db, "reviews"),
    where("uid", "==", uid),
    orderBy("timestamp", "desc")
  );

  if (num !== -1) {
    reviewsQuery = query(reviewsQuery, limit(num));
  }

  const reviewDocs = await getDocs(reviewsQuery);
  const userData = await getCachedUser(uid);

  for (let reviewDoc of reviewDocs.docs) {
    if (!reviewIds.has(reviewDoc.id)) {
      const reviewData = reviewDoc.data();
      review_list.push({
        id: reviewDoc.id,
        username: userData?.username,
        profilePicture: userData?.profilePicture,
        ...reviewData,
      });
      reviewIds.add(reviewDoc.id);
    }
  }

  let repostedReviewsQuery = query(
    collection(db, "reviews"),
    where("userReposts", "array-contains", uid)
  );

  const repostedReviewDocs = await getDocs(repostedReviewsQuery);
  const repostUids = repostedReviewDocs.docs.map((doc) => doc.data().uid);
  const repostUsersData = await batchGetUsers(repostUids);

  for (let repostedReviewDoc of repostedReviewDocs.docs) {
    if (!reviewIds.has(repostedReviewDoc.id)) {
      const repostedReviewData = repostedReviewDoc.data();
      const originalPosterData = repostUsersData[repostedReviewData.uid] || {};

      review_list.push({
        id: repostedReviewDoc.id,
        username: originalPosterData.username,
        profilePicture: originalPosterData.profilePicture,
        ...repostedReviewData,
        repostedBy: uid,
      });
      reviewIds.add(repostedReviewDoc.id);
    }
  }

  review_list.sort((a, b) => b.timestamp - a.timestamp);

  if (num !== -1) {
    review_list = review_list.slice(0, num);
  }

  return review_list;
}

export function parseReviewWithSpoilersToHTML(reviewText) {
  const splitText = reviewText.split(/\[spoiler\]|\[\/spoiler\]/);
  let htmlString = "";

  splitText.forEach((text, index) => {
    if (index % 2 === 0) {
      htmlString += text;
    } else {
      htmlString += `<span class="spoiler" onclick="this.style.backgroundColor = 'transparent'; this.style.color = 'inherit';">${text}</span>`;
    }
  });

  return htmlString;
}

export async function fetchUserRepostedReviews(numReposts, userId) {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("userReposts", "array-contains", userId),
      orderBy("timestamp", "desc")
    );

    const reviewsSnapshot = await getDocs(reviewsQuery);
    const uids = reviewsSnapshot.docs.map((doc) => doc.data().uid);
    const usersData = await batchGetUsers(uids);

    const repostedReviewsData = reviewsSnapshot.docs.map((reviewDoc) => {
      const reviewData = reviewDoc.data();
      const userData = usersData[reviewData.uid] || {};

      return {
        id: reviewDoc.id,
        username: userData.username,
        profilePicture: userData.profilePicture,
        ...reviewData,
      };
    });

    if (numReposts !== -1) {
      repostedReviewsData.sort(
        (a, b) => b.timestamp.seconds - a.timestamp.seconds
      );
      return repostedReviewsData.slice(0, numReposts);
    }

    return repostedReviewsData;
  } catch (error) {
    console.error("Error fetching reposted reviews:", error);
    throw error;
  }
}

export async function fetchCommentsByReviewId(review_id) {
  try {
    const q = query(collection(db, "reviews", review_id, "comments"));
    const querySnapshot = await getDocs(q);

    const uids = querySnapshot.docs.map((doc) => doc.data().uid?.toString());
    const usersData = await batchGetUsers(uids);

    const comments = querySnapshot.docs
      .map((docu) => {
        const commentData = docu.data();
        const userData = usersData[commentData.uid] || {};

        if (Object.keys(userData).length === 0) return null;

        return {
          id: docu.id,
          username: userData.username,
          profilePicture: userData.profilePicture,
          ...commentData,
        };
      })
      .filter(Boolean);

    comments.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    return comments;
  } catch (error) {
    console.error("Error fetching comments: ", error);
    throw new Error("Error fetching comments");
  }
}

export async function fetchRepliesByCommentId(review_id, comment_id) {
  try {
    const q = query(
      collection(db, "reviews", review_id, "comments", comment_id, "replies")
    );
    const querySnapshot = await getDocs(q);

    const uids = querySnapshot.docs.map((doc) => doc.data().uid?.toString());
    const usersData = await batchGetUsers(uids);

    const replies = querySnapshot.docs
      .map((docu) => {
        const replyData = docu.data();
        const userData = usersData[replyData.uid] || {};

        if (Object.keys(userData).length === 0) return null;

        return {
          id: docu.id,
          username: userData.username,
          profilePicture: userData.profilePicture,
          ...replyData,
        };
      })
      .filter(Boolean);

    replies.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw new Error("Error fetching replies");
  }
}
