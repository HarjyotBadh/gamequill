import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ReviewCard from "./ReviewCard";
import NavBar from "../components/NavBar";
import RepostedReviews from "../components/RepostedReviews";
import LikedReviews from "../components/LikedReviews";
import "../styles/RecentReviews.css";

const RecentReviews = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [sortByRating, setSortByRating] = useState(false);
  const [sortLowestToHighest, setSortLowestToHighest] = useState(false);
  const [userId, setUserId] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(8);

  // Load sorting preferences from browser cookies on component mount
  useEffect(() => {

    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        setUserId(theuserId);
        console.log(theuserId);
        fetchReviews();
      } else {
        // not logged in
      }
    });


    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(collection(db, "reviews"), where("uid", "==", userId));
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

    
  }, [sortByRating, sortLowestToHighest, userReviews]);

  const userCreatedReviews = userReviews.filter((review) => review.uid === userId);
  const repostedReviews = userReviews.filter((review) => review.uid !== userId);

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
    setReviewsToShow(userReviews.length);
  };
  const handleHideReviews = () => {
    setShowAllReviews(false);
    setReviewsToShow(8);
  };
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
        <h2>Your Created Reviews</h2>
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
          {userCreatedReviews
            .slice(0, showAllReviews ? userCreatedReviews.length : reviewsToShow)
            .map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                gameName={review.gameName}
                starAverage={review.starRating}
              />
            ))}
        </div>
        {!showAllReviews && userCreatedReviews.length > 8 && (
          <button onClick={handleShowAllReviews}>Show All Created Reviews</button>
        )}
        {showAllReviews && (
          <button onClick={handleHideReviews}>Hide Reviews</button>
        )}
        <LikedReviews
          userId={userId}
          showAllReviews={showAllReviews}
          reviewsToShow={reviewsToShow}
        />
        <RepostedReviews
          userId={userId}
          showAllReviews={showAllReviews}
          reviewsToShow={reviewsToShow}
        />
      </div>
    </div>
  );
};

export default RecentReviews;
