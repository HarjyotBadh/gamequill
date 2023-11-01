import { db } from "../firebase";

/**
 * Fetches reviews based on game_id and calculates the average rating.
 * @param {string} game_id - The ID of the game.
 * @returns {Promise<string>} The average rating as a string with one decimal point.
 */
export async function getAverageRatingByGameId(game_id) {
    // Create a reference to the Firestore collection
    const reviewsRef = db.collection('reviews'); // Assuming your reviews are stored in a collection named 'reviews'
    
    try {
        // Query Firestore for reviews with the provided game_id
        const snapshot = await reviewsRef.where('gameID', '==', game_id).get();
        
        // Extract review data from the snapshot
        const reviews = snapshot.docs.map(doc => doc.data());
        
        // Calculate and return the average rating
        return calculateAverageRating(reviews);
    } catch (error) {
        console.error("Error fetching reviews: ", error);
        return "0.0";
    }
}

/**
 * Calculates the average rating based on an array of reviews.
 * @param {Object[]} reviews - An array of review objects.
 * @param {number} reviews[].starRating - The star rating of the review.
 * @returns {string} The average rating as a string with one decimal point.
 * If there are no reviews, returns "0.0".
 */
export function calculateAverageRating(reviews) {
    // Calculate the average rating
    if (reviews.length === 0) {
        return "0.0";
    } else {
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.starRating,
            0
        );
        return (totalRating / reviews.length).toFixed(1);
    }
}

/**
 * Generates an array of stars based on the given rating.
 * The array contains 5 elements, each representing a star.
 * A value of 1 represents a full star, 0.5 represents a half star, and 0 represents an empty star.
 * @param {number} rating - The rating to generate stars for (has to be between 0->5)
 * @returns {JSX.Element[]} An array of JSX elements representing stars.
 */
export const generateStars = (rating) => {
    // Ensure rating is between 0 and 5
    const fullStars = Math.floor(rating);
    const starArr = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starArr.push(1);
    }

    // Check for half star
    if (rating - fullStars >= 0.1) {
        starArr.push(0.5);
    }

    // Ensure there are 5 stars in total
    while (starArr.length < 5) {
        starArr.push(0);
    }

    // Render stars based on the values in starArr
    return starArr.map((val, i) => {
        if (val === 1)
            return (
                <span key={i} className="fullStar">
                    ★
                </span>
            );
        else if (val === 0.5)
            return (
                <span key={i} className="halfStar">
                    ★
                </span>
            );
        else
            return (
                <span key={i} className="emptyStar">
                    ★
                </span>
            );
    });
};