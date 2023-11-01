import React from "react";
import { useParams } from "react-router-dom";
import { fetchGameData } from "../functions/GameFunctions";
import { Link } from "react-router-dom";
import { fetchReviewById } from "../functions/ReviewFunctions";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import StarSelection from "../components/StarSelection";
import ReviewProfile from "../components/ReviewProfile";
import { useNavigate } from "react-router-dom";
import "../styles/ReviewPage.css";
import Footer from "../components/Footer";

export default function ReviewPage() {
    const { review_id } = useParams();
    const [reviewData, setReviewData] = React.useState(null);
    const [gameData, setGameData] = React.useState(null);
    const [darkMode, setDarkMode] = React.useState(
        () =>
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [showSpoilers, setShowSpoilers] = React.useState(false);
    const navigate = useNavigate();

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

                const storedGameData = JSON.parse(localStorage.getItem(`gameData_${fetchedReview.gameID}`));
                console.log("Game id is " + fetchedReview.gameID);
                if (storedGameData && storedGameData.game && storedGameData.game.name) {
                    console.log("Loading gameData from localStorage");
                    setGameData(storedGameData);
                } else {
                    // Get the game data from IGDB
                    console.log("Calling fetchGameData in ReviewPage.js");
                    const gameDataResult = await fetchGameData(fetchedReview.gameID);
                    setGameData(gameDataResult);

                    // Store the fetched game data in localStorage
                    localStorage.setItem(`gameData_${fetchedReview.gameID}`, JSON.stringify(gameDataResult.game));
                }
            } catch (error) {
                console.error("Error fetching review or game data: ", error);
                // In case of an error or no document found, redirect user to home page.
                navigate("/");
            }
        };

        fetchReviewAndGameData();
    }, [review_id]);

  const toggleSpoilers = () => {
    setShowSpoilers((prevState) => !prevState);
  };

  const toggleSpoilersInText = (text, showSpoilers) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const spoilers = doc.querySelectorAll(".spoiler-effect");
    spoilers.forEach((spoiler) => {
      if (showSpoilers) {
        spoiler.classList.remove("spoiler-effect");
      } else {
        spoiler.classList.add("spoiler-effect");
      }
    });
    return doc.body.innerHTML;
  };

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
          <TitleCard gameData={gameData.game} />
        </div>

        {/* Right side */}
        <div className="review-content-container">
          <h1>Review Rating</h1>
          <StarSelection
            starRating={reviewData.starRating}
            setStarRating={() => {}}
            readOnly
          />
          <div className="toggle-spoilers">
            <label>
              <input
                type="checkbox"
                checked={showSpoilers}
                onChange={toggleSpoilers}
              />
              Show Spoilers
            </label>
          </div>

          <div
            className="review-text-snapshott text-justify"
            dangerouslySetInnerHTML={{
              __html: toggleSpoilersInText(reviewData.reviewText, showSpoilers),
            }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
