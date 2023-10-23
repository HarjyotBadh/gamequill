// GameLog.js
import React, { useState } from 'react';
import gameLoggedImage from '../images/buttons/gq-played-shadow.png'; // Import the image for "Game logged!"
import gameNotLoggedImage from '../images/buttons/gq-notplayed-shadow.png'; // Import the image for "Game not logged!"

const GameLog = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(prevState => !prevState);
        console.log(isClicked ? 'Remove game ID from Log array' : 'Add game ID to Log array');
    }

    return (
        <button onClick={handleButtonClick}>
            <img
                src={isClicked ? gameLoggedImage : gameNotLoggedImage}
                alt={isClicked ? 'Game logged!' : 'Game not logged.'}
            />
        </button>
    );
}

export default GameLog;