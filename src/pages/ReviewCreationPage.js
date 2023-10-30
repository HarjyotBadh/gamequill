import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Checkbox,
} from "@material-tailwind/react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import StarSelection from "../components/StarSelection";
import TitleCard from "../components/TitleCard";
import ReviewTextField from "../components/ReviewTextField";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/ReviewCreationPage.css";

export default function ReviewCreationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const gameData = location.state.gameData;
    const gameID = gameData.id;
    const [starRating, setStarRating] = React.useState(0); // default value
    const [reviewText, setReviewText] = React.useState("");
    const [error, setError] = React.useState("");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [containsSpoiler, setContainsSpoiler] = React.useState(false);

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

    const showErrorDialog = (message) => {
        setError(message);
        setIsDialogOpen(true);
    };

    const getTextFromHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    

    const handleSubmit = async () => {
        // Reset error state
        setError("");

        const textLength = getTextFromHtml(reviewText).length;

        // Check if the inputs are filled
        if (!starRating && !textLength) {
            showErrorDialog(
                "Please select a star rating and fill out the review text."
            );
            return;
        } else if (!starRating) {
            showErrorDialog("Please select a star rating.");
            return;
        } else if (!textLength) {
            showErrorDialog("Please fill out the review text.");
            return;
        }

        if (textLength > 5000) {
            showErrorDialog("Your review is too long.");
            return;
        }

        try {
            // Add a new document in the reviews collection, with a generated id.
            const docRef = await addDoc(collection(db, "reviews"), {
                starRating: starRating,
                reviewText: reviewText,
                gameID: gameID,
                gameName: gameData.name,
                gameCover: gameData.cover.url,
                containsSpoiler: containsSpoiler,
                timestamp: new Date(),
                uid: getAuth().currentUser.uid,
            });

            // Add the reviewID to the game's reviews list.
            const gameDocRef = doc(db, "games", gameID.toString());
            console.log("The gameDocRef is: ", gameDocRef);
            await updateDoc(gameDocRef, {
                reviews: arrayUnion(docRef.id),
            });

            // Add the review's ID to the user's profile in array of reviews.
            const userDocRef = doc(
                db,
                "profileData",
                getAuth().currentUser.uid
            );
            await updateDoc(userDocRef, {
                reviews: arrayUnion(docRef.id),
            });

            // Clear the form or navigate the user to a different page
            setReviewText("");
            setStarRating(0);

            // Move the user to the correct game page.
            navigate(`/game?game_id=${gameID}`);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div
            className={`review-page-wrapper ${darkMode ? "dark" : "light"}`}
            data-theme={darkMode ? "dark" : "light"}
        >
            <NavBar />

            <div className="review-page-stuff">
                <TitleCard gameData={gameData} />

                <div className="review-content-container">
                    <h1>Choose Rating</h1>
                    <StarSelection
                        starRating={starRating}
                        setStarRating={setStarRating}
                    />
                    <ReviewTextField
                        reviewText={reviewText}
                        setReviewText={setReviewText}
                    />

                    <div className="spoiler-checkbox-container flex items-center mt-4 mb-4">
                        <Checkbox
                            checked={containsSpoiler}
                            onChange={() =>
                                setContainsSpoiler(!containsSpoiler)
                            }
                            ripple={false}
                            className="spoiler-checkbox h-6 w-6 transition-all hover:scale-105"
                        />
                        <label
                            className="ml-2 spoiler-label"
                            style={{ color: darkMode ? "white" : "black" }}
                        >
                            Contains spoilers
                        </label>
                    </div>

                    {/* Post Review Button */}
                    <button
                        onClick={handleSubmit}
                        className="post-review-button"
                    >
                        Post Review
                    </button>
                </div>
            </div>

            {isDialogOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <Dialog
            open={isDialogOpen}
            handler={() => setIsDialogOpen(false)}
            size="md"
            dismiss={{
                enabled: true,
                escapeKey: true,
                outsidePress: true,
            }}
            animate={{
                mount: {
                    transition: { duration: 0.5, type: "fade" },
                },
                unmount: {
                    transition: { duration: 0.5, type: "fade" },
                },
            }}
            className={`rounded-lg z-50 max-w-xl ${darkMode ? "dark-dialog" : "light-dialog"}`}
        >
            <DialogHeader className="bg-red-500 text-white text-lg font-semibold p-4 rounded-t-lg flex items-center">
                Error
            </DialogHeader>
            <DialogBody className="p-4">{error}</DialogBody>
            <DialogFooter className="flex justify-end bg-gray-100 p-4 rounded-b-lg">
                <Button
                    onClick={() => setIsDialogOpen(false)}
                    ripple="light"
                    className="bg-gray-200 text-black font-semibold px-6 py-2"
                >
                    Okay
                </Button>
            </DialogFooter>
        </Dialog>
    </div>
)}







            <Footer />

        </div>
    );
}
