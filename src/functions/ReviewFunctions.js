import { db } from "../firebase";
import { doc, getDoc, getDocs, query, where, collection, orderBy, limit } from "firebase/firestore";

/**
 * Fetches all reviews for a given game ID from the Firestore database.
 * @param {string} game_id - The ID of the game to fetch reviews for.
 * @returns {Array} An array of review objects, sorted by timestamp (most recent first).
 */
export async function fetchReviewsByGameId(game_id) {
    // Query the reviews collection based on game ID
    const reviewsQuery = query(
        collection(db, "reviews"),
        where("gameID", "==", game_id)
    );
    const querySnapshot = await getDocs(reviewsQuery);

    // Fetch the user data for each review
    const fetchedReviews = [];
    for (let document of querySnapshot.docs) {
        const userRef = doc(
            db,
            "profileData",
            document.data().uid.toString()
        );
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        // Construct the review object, which includes the user data
        fetchedReviews.push({
            id: document.id,
            username: userData.username,
            profilePicture: userData.profilePicture,
            ...document.data(),
        });
    }

    // Sort reviews by timestamp (most recent first)
    fetchedReviews.sort((a, b) => {
        return b.timestamp.seconds - a.timestamp.seconds;
    });

    return fetchedReviews;
}

/**
 * Fetches a single review from the Firestore database based on its ID.
 * @param {string} review_id - The ID of the review to fetch.
 * @returns {Object} A review object that includes both the review data and the associated user data.
 * @throws {Error} If no review is found for the given ID or if no user is found for the associated UID.
 */
export async function fetchReviewById(review_id) {
    // Query the reviews collection based on review ID
    const reviewRef = doc(db, "reviews", review_id);
    const reviewDoc = await getDoc(reviewRef);
    if (!reviewDoc.exists()) {
        throw new Error(`No review found for ID: ${review_id}`);
    }
    const reviewData = reviewDoc.data();

    // Retrieve related user data using the uid from the review document
    const userRef = doc(db, "profileData", reviewData.uid.toString());
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        throw new Error(`No user found for UID: ${reviewData.uid}`);
    }
    const userData = userDoc.data();

    // Construct and return the review object
    return {
        id: reviewDoc.id,
        username: userData.username,
        profilePicture: userData.profilePicture,
        ...reviewData,
    };
}


/**
 * Fetches the most recent reviews from friends based on the specified number.
 * @param {number} numReviews - The number of reviews to fetch (use -1 for all reviews).
 * @param {string} currentUserId - The UID of the  user to fetch the friends' reviews.
 * @returns {Array} A list of review objects from friends.
 */
export async function fetchFriendsRecentReviews(numReviews, currentUserId) {
    if (!currentUserId) {
        console.error("No current user ID provided");
        return [];
    } else {
        console.log("UID provided.");
    }
    
    // Retrieve the current user's friends list
    const userRef = doc(db, "profileData", currentUserId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        throw new Error(`No user found for UID: ${currentUserId}`);
    }
    const followersList = userDoc.data().follows;

    if (!followersList || followersList.length === 0 || followersList[0] === "") {
        return [];
    }

    let allReviews = [];

    // Loop through each friend's UID and fetch their reviews
    for (let uid of followersList) {

        // Start with base query
        let reviewsQuery = query(
            collection(db, "reviews"),
            where("uid", "==", uid),
            orderBy("timestamp", "desc")
        );

        // Add limit if numReviews isn't -1
        if (numReviews !== -1) {
            reviewsQuery = query(reviewsQuery, limit(numReviews));
        }

        const reviewDocs = await getDocs(reviewsQuery);

        for (let reviewDoc of reviewDocs.docs) {
            const reviewData = reviewDoc.data();
            const userDataRef = doc(db, "profileData", uid);
            const userDataDoc = await getDoc(userDataRef);
            const userData = userDataDoc.data();

            // Construct the review object
            allReviews.push({
                id: reviewDoc.id,
                username: userData.username,
                profilePicture: userData.profilePicture,
                ...reviewData,
            });
        }
    }

    // Sort the reviews by timestamp and limit the number of reviews
    if (numReviews !== -1) {
        allReviews.sort((a, b) => b.timestamp - a.timestamp);
        allReviews = allReviews.slice(0, numReviews);
    }

    return allReviews;
}

/**
 * Fetches an array of recent reviews from the specified user.
 * @param {number} num - The number of reviews you want to retrieve.
 * @param {string} uid - The UID of the user you want to retrieve reviews from.
 * @returns {Array} - The {num} most recent reviews from {uid}.
 */
export async function fetchUserRecentReviews(num, uid) {
    let review_list = [];
    let reviewIds = new Set(); // Set to track unique review IDs
 
    // Base query for user's own reviews
    let reviewsQuery = query(
        collection(db, "reviews"),
        where("uid", "==", uid),
        orderBy("timestamp", "desc")
    );
 
    // Add limit if num isn't -1
    if (num !== -1) {
        reviewsQuery = query(reviewsQuery, limit(num));
    }
 
    // Fetch and process user's own reviews
    const reviewDocs = await getDocs(reviewsQuery);
    for (let reviewDoc of reviewDocs.docs) {
        if (!reviewIds.has(reviewDoc.id)) {
            const reviewData = reviewDoc.data();
            const userDataRef = doc(db, "profileData", uid);
            const userDataDoc = await getDoc(userDataRef);
            const userData = userDataDoc.data();
 
            // Construct the review object
            review_list.push({
                id: reviewDoc.id,
                username: userData.username,
                profilePicture: userData.profilePicture,
                ...reviewData,
            });
            reviewIds.add(reviewDoc.id);
        }
    }
 
    // Query for reviews reposted by the user
    let repostedReviewsQuery = query(
        collection(db, "reviews"),
        where("userReposts", "array-contains", uid)
    );
 
    // Fetch and process reposted reviews
    const repostedReviewDocs = await getDocs(repostedReviewsQuery);
    for (let repostedReviewDoc of repostedReviewDocs.docs) {
        if (!reviewIds.has(repostedReviewDoc.id)) {
            const repostedReviewData = repostedReviewDoc.data();
            const originalPosterUid = repostedReviewData.uid;
            const originalPosterDataRef = doc(db, "profileData", originalPosterUid);
            const originalPosterDataDoc = await getDoc(originalPosterDataRef);
            const originalPosterData = originalPosterDataDoc.data();
 
            // Construct the reposted review object
            review_list.push({
                id: repostedReviewDoc.id,
                username: originalPosterData.username,
                profilePicture: originalPosterData.profilePicture,
                ...repostedReviewData,
                repostedBy: uid, // Indicate this review is reposted by the user
            });
            reviewIds.add(repostedReviewDoc.id);
        }
    }
 
    // You might want to sort review_list by timestamp if needed
    review_list.sort((a, b) => b.timestamp - a.timestamp);
 
    // Only return the first {num} reviews if num isn't -1
    if (num !== -1) {
        review_list = review_list.slice(0, num);
    }
 
    return review_list;
}


/**
 * Parses a review text with spoiler tags and returns an HTML string with spoiler text hidden until clicked.
 * @param {string} reviewText - The review text to parse.
 * @returns {string} An HTML string with spoiler text hidden until clicked.
 */
export function parseReviewWithSpoilersToHTML(reviewText) {
    const splitText = reviewText.split(/\[spoiler\]|\[\/spoiler\]/);
    let htmlString = "";

    splitText.forEach((text, index) => {
        if (index % 2 === 0) {
            // Regular text
            htmlString += text;
        } else {
            // Spoiler text
            htmlString += `<span class="spoiler" onclick="this.style.backgroundColor = 'transparent'; this.style.color = 'inherit';">${text}</span>`;
        }
    });

    return htmlString;
}

/**
 * Fetches the most recent reposted reviews for the specified user.
 * @param {number} numReposts - The number of reposted reviews to fetch (use -1 for all reposts).
 * @param {string} userId - The UID of the user to fetch reposted reviews.
 * @returns {Array} A list of reposted review objects.
 */
export async function fetchUserRepostedReviews(numReposts, userId) {
    try {
        // Query the "Reviews" collection to get documents where userReposts array contains userId
        const reviewsQuery = query(
            collection(db, "reviews"),
            where("userReposts", "array-contains", userId),
            orderBy("timestamp", "desc")
        );

        const reviewsSnapshot = await getDocs(reviewsQuery);

        // Fetch the corresponding review data for each repost
        const repostedReviewsData = [];
        for (const reviewDoc of reviewsSnapshot.docs) {
            const reviewData = reviewDoc.data();
            const userDataRef = doc(db, "profileData", reviewData.uid);
            const userDataDoc = await getDoc(userDataRef);
            const userData = userDataDoc.data();

            // Construct the reposted review object
            repostedReviewsData.push({
                id: reviewDoc.id,
                username: userData.username,
                profilePicture: userData.profilePicture,
                ...reviewData,
            });
        }

        // Sort the reposted reviews by timestamp and limit the number of reviews
        if (numReposts !== -1) {
            repostedReviewsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
            return repostedReviewsData.slice(0, numReposts);
        }

        return repostedReviewsData;
    } catch (error) {
        console.error("Error fetching reposted reviews:", error);
        throw error;
    }
}

/**
 * Fetches comments for a specific review from the Firestore database.
 * @param {string} review_id - The ID of the review for which to fetch comments.
 * @returns {Array} An array of comment objects, each including the comment data and the associated user data.
 * @throws {Error} If an error occurs while fetching data.
 */
export async function fetchCommentsByReviewId(review_id) {
    try {
        console.log("Reading from Firebase: fetchCommentsByReviewId");
        const q = query(collection(db, "reviews", review_id, "comments"));
        const querySnapshot = await getDocs(q);
        const comments = [];

        for (const docu of querySnapshot.docs) {
            const commentData = docu.data();

            // Retrieve related user data using the uid from the comment document
            const userRef = doc(db, "profileData", commentData.uid.toString());
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                comments.push({
                    id: docu.id,
                    username: userData.username,
                    profilePicture: userData.profilePicture,
                    ...commentData,
                });
            }
        }

        // Sort comments by timestamp (most recent first)
        comments.sort((a, b) => {
            return b.timestamp.seconds - a.timestamp.seconds;
        });

        return comments;
    } catch (error) {
        console.error("Error fetching comments: ", error);
        throw new Error("Error fetching comments");
    }
}

/**
 * Fetches replies for a specific comment from the Firestore database.
 * @param {string} review_id - The ID of the review.
 * @param {string} comment_id - The ID of the comment for which to fetch replies.
 * @returns {Array} An array of reply objects, each including the reply data and the associated user data.
 * @throws {Error} If an error occurs while fetching data.
 */
export async function fetchRepliesByCommentId(review_id, comment_id) {
    try {
        console.log("Reading from Firebase: fetchRepliesByCommentId");
        const q = query(collection(db, "reviews", review_id, "comments", comment_id, "replies"));
        const querySnapshot = await getDocs(q);
        const replies = [];

        for (const docu of querySnapshot.docs) {
            const replyData = docu.data();

            // Retrieve related user data using the uid from the reply document
            const userRef = doc(db, "profileData", replyData.uid.toString());
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                replies.push({
                    id: docu.id,
                    username: userData.username,
                    profilePicture: userData.profilePicture,
                    ...replyData,
                });
            }
        }

        // Sort replies by timestamp (most recent first)
        replies.sort((a, b) => {
            return b.timestamp.seconds - a.timestamp.seconds;
        });

        return replies;
    } catch (error) {
        console.error("Error fetching replies: ", error);
        throw new Error("Error fetching replies");
    }
}



