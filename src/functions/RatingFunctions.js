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