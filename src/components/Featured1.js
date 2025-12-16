import React, { useState } from "react";
import "../styles/Featured1.css";
import tempscreenshot from "../images/temp_images/tempscreenshot.png";
import { calculateAverageRating } from "../functions/RatingFunctions";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";

export default function Featured1({ gameData, screenshots }) {
  const [averageRating, setAverageRating] = useState(null);

  React.useEffect(() => {
    // If rating is passed as a prop, don't fetch it again
    if (gameData.rating !== undefined) {
      setAverageRating(gameData.rating);
      return;
    }

    if (gameData.id) {
      fetchReviewsByGameId(gameData.id).then((reviews) => {
        setAverageRating(calculateAverageRating(reviews));
      });
    }
  }, [gameData]);

  if (!gameData) {
    return (
      <div class="image-cont rounded-corners">
        <div class="image-container2">
          <img src={tempscreenshot} alt="Pikmin Test" />
        </div>
      </div>
    );
  }
  var imageUrl =
    screenshots && screenshots.length > 0 ? screenshots[0] : tempscreenshot;
  var company =
    gameData.involved_companies && gameData.involved_companies.length > 0
      ? gameData.involved_companies[0]?.company?.name
      : "Unknown Developer";
  var rating = averageRating;

  // Rating logic ends

  return (
    <div class="image-cont rounded-corners">
      <div class="image-container2">
        <img src={imageUrl} alt="Pikmin Test" className="Featured1-image" />
      </div>
      <div class="overlay"></div>
      <div class="text-overlay">
        <div class="game-name1">{gameData.name}</div>
        <div class="developer1">
          {company} - {rating}
        </div>
      </div>
    </div>
  );
}
