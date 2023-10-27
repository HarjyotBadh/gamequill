import { db } from "../firebase";
import { doc, getDoc, getDocs, query, where, collection, orderBy, limit } from "firebase/firestore";
import React from "react";

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
    // Retrieve the current user's friends list
    const userRef = doc(db, "profileData", currentUserId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        throw new Error(`No user found for UID: ${currentUserId}`);
    }
    const followersList = userDoc.data().followersList;

    let allReviews = [];

    // Loop through each friend's UID and fetch their reviews
    for (let uid of followersList) {
        const reviewsQuery = query(
            collection(db, "reviews"),
            where("uid", "==", uid),
            orderBy("timestamp", "desc"),
            numReviews === -1 ? undefined : limit(numReviews)
        );

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

    return allReviews;
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
