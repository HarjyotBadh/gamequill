import React, { useState } from 'react';
import addWishlistImage from '../images/buttons/addwishlist.png';
import removeImage from '../images/buttons/remove.png';

const AddWishlistButton = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(prevState => !prevState);
    }

    return (
        <button onClick={handleButtonClick}>
            <img
                src={isClicked ? removeImage : addWishlistImage}
                alt={isClicked ? "Remove from Wishlist" : "Add to Wishlist"}
            />
        </button>
    );
}

export default AddWishlistButton;
