import React from "react";
import { useParams } from "react-router-dom";
import { fetchGameData } from "../functions/GameFunctions";
import { Link } from "react-router-dom";
import { fetchReviewById } from "../functions/ReviewFunctions";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import CommentDisplay from "../components/CommentDisplay";
import CommentCreator from "../components/CommentCreator";
import StarSelection from "../components/StarSelection";
import ReviewProfile from "../components/ReviewProfile";
import { useNavigate } from "react-router-dom";
import "../styles/ReviewPage.css";
import Footer from "../components/Footer";
import { db, auth } from "../firebase";
import {
    doc,
    deleteDoc,
    query,
    collection,
    where,
    getDocs,
} from "firebase/firestore";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function ReviewPage() {
    const { review_id } = useParams();
    const [reviewData, setReviewData] = React.useState(null);
    const [gameData, setGameData] = React.useState(null);
    const [showSpoilers, setShowSpoilers] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [gameID, setGameID] = React.useState(null);
    const [hasCommented, setHasCommented] = React.useState(false);
    const currentUserUid = auth.currentUser?.uid;
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchReviewAndGameData = async () => {
            try {
                const fetchedReview = await fetchReviewById(review_id);
                setReviewData(fetchedReview);

                const storedGameData = JSON.parse(
                    localStorage.getItem(`gameData_${fetchedReview.gameID}`)
                );
                setGameID(fetchedReview.gameID);
                if (
                    storedGameData &&
                    storedGameData.game &&
                    storedGameData.game.name
                ) {
                    setGameData(storedGameData);
                } else {
                    // Get the game data from IGDB
                    const gameDataResult = await fetchGameData(
                        fetchedReview.gameID
                    );
                    setGameData(gameDataResult);

                    // Store the fetched game data in localStorage
                    localStorage.setItem(
                        `gameData_${fetchedReview.gameID}`,
                        JSON.stringify(gameDataResult.game)
                    );
                }

                // Check if the current user has already commented
                const commentQuery = query(
                    collection(db, "reviews", review_id, "comments"),
                    where("uid", "==", currentUserUid)
                );
                const querySnapshot = await getDocs(commentQuery);
                if (!querySnapshot.empty) {
                    // User has already commented
                    setHasCommented(true);
                }
            } catch (error) {
                console.error("Error fetching review or game data: ", error);
                // In case of an error or no document found, redirect user to home page.
                // navigate("/");
            }
        };

        fetchReviewAndGameData();
    }, [review_id, hasCommented, currentUserUid]);

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

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

    const handleDeleteReview = () => {
        openDeleteModal();
    };

    const handleConfirmDelete = async () => {
        const isDeleted = await deleteReview(review_id);
        if (isDeleted) {
            navigate(`/game?game_id=${gameID}`);
        } else {
            console.error("Error deleting review");
        }
        closeDeleteModal();
    };

    const deleteReview = async (reviewId) => {
        try {
            await deleteDoc(doc(db, "reviews", reviewId));
            console.log("Review deleted successfully");
            return true;
        } catch (error) {
            console.error("Error deleting review: ", error);
            return false;
        }
    };

    if (!reviewData) {
        return <div>Loading...</div>; // Show a loading state while fetching the data
    }

    if (!gameData) {
        return <div>Loading...</div>; // Show a loading state while fetching the data
    }

    return (
        <div className={`review-page-wrapper`}>
            <NavBar />
            <div className="review-page-layout">
                {/* Left side */}
                <div className="left-column">
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
                </div>
                {/* Right side */}
                <div className="right-column">
                    <div className="review-content-container">
                        <h1>Review Rating</h1>
                        <StarSelection
                            starRating={reviewData.starRating}
                            setStarRating={() => {}}
                            readOnly
                        />
                        <div className="toggle-spoilers">
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showSpoilers}
                                            onChange={toggleSpoilers}
                                            name="showSpoilers"
                                            color="primary"
                                        />
                                    }
                                    label="Show Spoilers"
                                    sx={{
                                        '& .MuiFormControlLabel-label': { 
                                            color: 'var(--text-color)'
                                        }
                                    }}
                                />
                            </FormGroup>
                        </div>

                        {currentUserUid === reviewData.uid && (
                            <button
                                className="delete-review-btn"
                                onClick={handleDeleteReview}
                            >
                                Delete Review
                            </button>
                        )}

                        {showDeleteModal && (
                            <div className="delete-account-modal">
                                <div className="delete-account-modal-content">
                                    <span
                                        className="close"
                                        onClick={closeDeleteModal}
                                    >
                                        &times;
                                    </span>
                                    <p>
                                        Are you sure you want to delete this
                                        review? This action is irreversible.
                                    </p>
                                    <button onClick={handleConfirmDelete}>
                                        Confirm Deletion
                                    </button>
                                    <button onClick={closeDeleteModal}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div
                            className="review-text-snapshott text-justify"
                            dangerouslySetInnerHTML={{
                                __html: toggleSpoilersInText(
                                    reviewData.reviewText,
                                    showSpoilers
                                ),
                            }}
                        />
                    </div>

                    {/* Comment section */}
                    {!hasCommented && (
                        <div className="review-comment-section">
                            <CommentCreator
                                review_id={review_id}
                                currentUserUID={currentUserUid}
                                setHasCommented={setHasCommented}
                            />
                        </div>
                    )}

                    {/* Comment Display section */}
                    <div className="comment-display-section">
                        <CommentDisplay
                            review_id={review_id}
                            hasCommented={hasCommented}
                            setHasCommented={setHasCommented}
                            currentUserUid={currentUserUid}
                        />
                    </div>
                </div>
                {/* End of right-container */}
            </div>

            {/* <CommentCreator review_id={review_id} currentUserUID={currentUserUid} /> */}

            <Footer />
        </div>
    );
}
