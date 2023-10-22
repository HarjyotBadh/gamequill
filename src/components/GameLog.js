// GameLog.js
import React, { useState } from 'react';
import gameLoggedImage from '../images/buttons/gq-log (1).png'; // Import the image for "Game logged!"
import gameNotLoggedImage from '../images/buttons/gq-played.png'; // Import the image for "Game not logged!"

const GameLog = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(prevState => !prevState);
        console.log(isClicked ? 'Remove game ID from array' : 'Add game ID to array');
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