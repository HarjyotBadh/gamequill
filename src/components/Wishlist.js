import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import "../styles/Wishlist.css";
import NavBar from "../components/NavBar";
import { fetchGameData } from "../functions/GameFunctions";
import { Link } from "react-router-dom";

const WishlistButton = ({ gameID, handleRemove }) => {
  const handleButtonClick = () => {
    handleRemove(gameID);
  };

  return (
    <button className="wishlist-button remove" onClick={handleButtonClick}>
      Remove
    </button>
  );
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [gameInfo, setGameInfo] = useState({});
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();
      if (authObj) {
        const theuserId = authObj.uid;
        setUserId(theuserId);
        console.log(theuserId);
        fetchWishlist();
      } else {
        // not logged in
      }
    });

    const fetchWishlist = async () => {
      try {
        const user = auth.currentUser.uid;
        const docRef = doc(db, "profileData", user);
        const docSnap = await getDoc(docRef);
        const docWishlist = docSnap.data().wishlist || [];

        setWishlistItems(docWishlist);

        // Fetch game information for each game in the wishlist using the provided API call
        const gameInfoPromises = docWishlist.map(async (gameID) => {
          const gameData = await fetchGameData(gameID);
          return { gameID, gameData };
        });

        const gameDataArray = await Promise.all(gameInfoPromises);
        const gameDataMap = {};

        gameDataArray.forEach((item) => {
          gameDataMap[item.gameID] = item.gameData.game; // Assuming the structure of the data is the same
        });

        setGameInfo(gameDataMap);
      } catch (error) {
        console.error("Error fetching wishlist data from Firestore:", error);
      }
    };

    fetchWishlist();
  }, []);

  const removeGameFromWishlist = async (gameID) => {
    const user = auth.currentUser.uid;
    const docRef = doc(db, "profileData", user);

    try {
      await updateDoc(docRef, {
        wishlist: arrayRemove(gameID),
      });
    } catch (error) {
      console.error("Error removing data from Firestore:", error);
    }

    setWishlistItems(wishlistItems.filter((item) => item !== gameID));
  };

  return (
    <div>
      <NavBar />
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Video Game Wishlist</h1>
        <div className="wishlist">
          {wishlistItems.map((gameID, index) => (
            <div key={index} className="game-box">
              <div className="game-info">
                <Link to={`/game?game_id=${gameID}`}>
                  {gameInfo[gameID]?.cover && (
                    <img
                      src={gameInfo[gameID].cover.url}
                      alt={`${gameInfo[gameID].name} Cover`}
                    />
                  )}
                  <span className="profile-game-card">
                    {gameInfo[gameID]?.name}
                  </span>
                </Link>
                <div>
                  <WishlistButton
                    gameID={gameID}
                    handleRemove={removeGameFromWishlist}
                  />
                </div>
              </div>
              {/* Display other game information here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
