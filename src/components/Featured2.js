import React from "react";
import "../styles/Featured2.css";
import tempscreenshot from "../images/temp_images/tempscreenshot.png";
import defaultImage from "../images/temp_images/Default_No_Image_Available.png";
import { calculateAverageRating } from "../functions/RatingFunctions";
import { fetchReviewsByGameId } from "../functions/ReviewFunctions";

export default function Featured1({ gameData, screenshots, limitSize }) {
    const [averageRating, setAverageRating] = React.useState(null);

    React.useEffect(() => {
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
                    <img src={tempscreenshot} alt="Error Loading" />
                </div>
            </div>
        );
    }

    var imageUrl = screenshots && screenshots[0] ? screenshots[0] : defaultImage;
    let company = "";
    if (gameData.involved_companies && gameData.involved_companies.length > 0) {
        company = gameData.involved_companies[0].company.name;
    }

    var rating = averageRating;

    return (
        <div class="image-cont rounded-corners">
            <div class="image-container2">
                <img
                    src={imageUrl}
                    alt="Error Loading"
                    class={limitSize ? "limited-height" : ""}
                />
            </div>
            <div class="overlay"></div>
            <div class="text-overlay">
                <div class="game-name2">{gameData.name}</div>
                <div class="developer">
                    {company} - {rating}
                </div>
            </div>
        </div>
    );
}
