
import React, { useState } from 'react';
import gameLikedImage from '../images/buttons/gq-liked-shadow.png';
import gameNotLikedImage from '../images/buttons/gq-notliked-shadow.png';

const GameLike = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(prevState => !prevState);
        console.log(isClicked ? 'Remove game ID from Like array' : 'Add game ID to Like array');
    }

    return (
        <button onClick={handleButtonClick}>
            <img
                src={isClicked ? gameLikedImage : gameNotLikedImage}
                alt={isClicked ? 'Game liked!' : 'Game not liked.'}
            />
        </button>
    );
}

export default GameLike;