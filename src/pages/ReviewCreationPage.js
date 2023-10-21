import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "@material-tailwind/react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";
import { db } from "../firebase";
import StarSelection from "../components/StarSelection";
import TitleCard from "../components/TitleCard";
import ReviewTextField from "../components/ReviewTextField";
import NavBar from "../components/NavBar";
import "../styles/ReviewCreationPage.css";
import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

export default function ReviewCreationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const gameData = location.state.gameData;
    const gameID = gameData.id;
    const [starRating, setStarRating] = React.useState(0); // default value
    const [reviewText, setReviewText] = React.useState("");
    const [error, setError] = React.useState("");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

    const handleSubmit = async () => {
        // Reset error state
        setError("");

        // Check if the inputs are filled
        if (!starRating && !reviewText) {
            showErrorDialog(
                "Please select a star rating and fill out the review text."
            );
            return;
        } else if (!starRating) {
            showErrorDialog("Please select a star rating.");
            return;
        } else if (!reviewText) {
            showErrorDialog("Please fill out the review text.");
            return;
        }

        try {
            // Add a new document with a generated id.
            const docRef = await addDoc(collection(db, "reviews"), {
                starRating: starRating,
                reviewText: reviewText,
                gameID: gameID,
                timestamp: new Date(),
                uid: getAuth().currentUser.uid,
            });

            // Reference to the user's document
            const userDocRef = doc(
                db,
                "profileData",
                getAuth().currentUser.uid
            );

            // Add the review's ID to the user's profile in array of reviews
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
      <div className={`review-page-wrapper ${darkMode ? "dark" : "light"}`} data-theme={darkMode ? "dark" : "light"}>
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

              {/* Post Review Button */}
              <button onClick={handleSubmit} className="post-review-button">
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
                  className="rounded-lg z-50 centered-dialog"
              >
                  <DialogHeader className="bg-blue-500 text-white text-lg font-semibold p-4 rounded-t-lg">
                      Error
                  </DialogHeader>
                  <DialogBody className="p-4">{error}</DialogBody>
                  <DialogFooter className="flex justify-end bg-gray-100 p-4 rounded-b-lg">
                      <Button
                          color="green"
                          onClick={() => setIsDialogOpen(false)}
                          ripple="light"
                          className="text-white font-semibold"
                      >
                          Okay
                      </Button>
                  </DialogFooter>
              </Dialog>
          </div>
      )}
  </div>
    );
}
