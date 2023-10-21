// GameLog.js
import React, { useState } from 'react';

const GameLog = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(prevState => !prevState);
        console.log(isClicked ? 'Remove game ID from array' : 'Add game ID to array');
    }

    return (
        <button onClick={handleButtonClick}>
            {isClicked ? 'Game logged!' : 'Game not logged.'}
        </button>
    );
}

export default GameLog;