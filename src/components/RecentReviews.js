// RecentReviews.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import ReviewCard from "./ReviewCard";
import NavBar from "../components/NavBar";
import "../styles/RecentReviews.css";

const RecentReviews = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [sortByRating, setSortByRating] = useState(false);
  const [sortLowestToHighest, setSortLowestToHighest] = useState(false);

  useEffect(() => {
    const userId = getAuth().currentUser.uid;
    const reviewsQuery = query(collection(db, "reviews"), where("uid", "==", userId));

    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(reviewsQuery);
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });

        if (sortByRating) {
          if (sortLowestToHighest) {
            reviews.sort((a, b) => a.starRating - b.starRating); // Lowest to highest
          } else {
            reviews.sort((a, b) => b.starRating - a.starRating); // Highest to lowest
          }
        } else {
          reviews.sort((a, b) => b.timestamp - a.timestamp);
        }

        setUserReviews(reviews);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    fetchReviews();
  }, [sortByRating, sortLowestToHighest]);

  const handleSortByRatingToggle = (lowestToHighest) => {
    if (sortByRating && lowestToHighest === sortLowestToHighest) {
      setSortByRating(false);
      setSortLowestToHighest(false);
    } else {
      setSortByRating(true);
      setSortLowestToHighest(lowestToHighest);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="recent-reviews">
        <h2>Your Recent Reviews</h2>
        <div className="sort-options">
          <label>
            Sort by Rating (Highest to Lowest):
            <input
              type="checkbox"
              checked={sortByRating && !sortLowestToHighest}
              onChange={() => handleSortByRatingToggle(false)}
            />
          </label>
          <label>
            Sort by Rating (Lowest to Highest):
            <input
              type="checkbox"
              checked={sortByRating && sortLowestToHighest}
              onChange={() => handleSortByRatingToggle(true)}
            />
          </label>
        </div>
        <div className="review-list">
          {userReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              gameName={review.gameName}
              starAverage={review.starRating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentReviews;
