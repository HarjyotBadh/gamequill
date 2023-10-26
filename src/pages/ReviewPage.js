import React from "react";
import { useParams } from "react-router-dom";
import { fetchGameDataFromIGDB } from "./GamePage";
import { Link } from "react-router-dom";
import { fetchReviewById } from "../functions/ReviewFunctions";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import StarSelection from "../components/StarSelection";
import ReviewProfile from "../components/ReviewProfile";
import "../styles/ReviewPage.css";

export default function ReviewPage() {
    const { review_id } = useParams();
    const [reviewData, setReviewData] = React.useState(null);
    const [gameData, setGameData] = React.useState(null);
    const [darkMode, setDarkMode] = React.useState(
        () =>
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    React.useEffect(() => {
        const matcher = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e) => setDarkMode(e.matches);
        matcher.addListener(onChange);
        return () => {
            matcher.removeListener(onChange);
        };
    }, []);

    React.useEffect(() => {
        const fetchReviewAndGameData = async () => {
            try {
                const fetchedReview = await fetchReviewById(review_id);
                setReviewData(fetchedReview);

                // Get the game data from IGDB
                const gameDataFromIGDB = await fetchGameDataFromIGDB(
                    fetchedReview.gameID
                );
                setGameData(gameDataFromIGDB.game);
            } catch (error) {
                console.error("Error fetching review or game data: ", error);
                // In case of an error or no document found, redirect user to home page.
                window.location.href = "/home";
            }
        };

        fetchReviewAndGameData();
    }, [review_id]);

    if (!reviewData) {
        return <div>Loading...</div>; // Show a loading state while fetching the data
    }

    if (!gameData) {
        return <div>Loading...</div>; // Show a loading state while fetching the data
    }

    return (
        <div
            className={`review-page-wrapper ${darkMode ? "dark" : "light"}`}
            data-theme={darkMode ? "dark" : "light"}
        >
            <NavBar />
            <div className="flex review-page-stuff">
                {/* Left side */}
                <div className="left-container flex flex-col items-center">
                    <Link to={`/Profile?user_id=${reviewData.uid}`}>
                        <ReviewProfile
                            username={reviewData.username}
                            timestamp={reviewData.timestamp}
                            profilePicture={reviewData.profilePicture}
                        />
                    </Link>
                    <TitleCard gameData={gameData} />
                </div>

                {/* Right side */}
                <div className="review-content-container">
                    <h1>Review Rating</h1>
                    <StarSelection
                        starRating={reviewData.starRating}
                        setStarRating={() => {}}
                        readOnly
                    />
                    <div className="review-text">
                        <pre>{reviewData.reviewText}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}