import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './Wishlist.css'; // Import your CSS file
import NavBar from "../components/NavBar";

const WishlistButton = ({ gameTitle, handleRemove }) => {
  const [isInWishlist, setIsInWishlist] = useState(true);

  const handleButtonClick = async () => {
    setIsInWishlist(false);
    handleRemove(gameTitle);
  };

  return (
    <button
      className="wishlist-button remove"
      onClick={handleButtonClick}
    >
      Remove
    </button>
  );
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [newGameTitle, setNewGameTitle] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = auth.currentUser.uid;
        const docRef = doc(db, 'profileData', user);
        const docSnap = await getDoc(docRef);
        const docWishlist = docSnap.data().wishlist || [];
        setWishlistItems(docWishlist);
      } catch (error) {
        console.error('Error fetching wishlist data from Firestore:', error);
      }
    };

    fetchWishlist();
  }, []);

  const addGameToWishlist = async () => {
    if (newGameTitle.trim() === '') {
      return;
    }

    // Update Firestore with the new game added to the wishlist
    const user = auth.currentUser.uid;
    const docRef = doc(db, 'profileData', user);

    try {
      await updateDoc(docRef, {
        wishlist: arrayUnion(newGameTitle),
      });
    } catch (error) {
      console.error('Error updating data in Firestore:', error);
    }

    setWishlistItems([...wishlistItems, newGameTitle]);
    setNewGameTitle('');
  };

  const removeGameFromWishlist = async (gameTitle) => {
    const user = auth.currentUser.uid;
    const docRef = doc(db, 'profileData', user);

    try {
      await updateDoc(docRef, {
        wishlist: arrayRemove(gameTitle),
      });
    } catch (error) {
      console.error('Error removing data from Firestore:', error);
    }

    setWishlistItems(wishlistItems.filter(item => item !== gameTitle));
  };

  return (
    <div>
      <NavBar />
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Video Game Wishlist</h1>
        <div className="wishlist">
          {wishlistItems.map((game, index) => (
            <div key={index} className="game-box">
              <div className="game-info">
                <span className="game-title">{game}</span>
                <WishlistButton gameTitle={game} handleRemove={removeGameFromWishlist} />
              </div>
            </div>
          ))}
        </div>
        <div className="add-game-form">
          <input
            type="text"
            placeholder="Enter a game title"
            value={newGameTitle}
            onChange={(e) => setNewGameTitle(e.target.value)}
          />
          <button onClick={addGameToWishlist}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
