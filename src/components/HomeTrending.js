import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeTrending.css";
import Featured1 from "./Featured1";
import Featured2 from "./Featured2";
import { fetchMultipleGameData } from "../functions/GameFunctions";

function App() {
    const [gamesData, setGamesData] = useState([]);

    const game_ids = [96437, 254339, 148241, 127044, 78511];

    useEffect(() => {
        (async () => {
            const fetchedGamesData = await fetchMultipleGameData(game_ids);
            setGamesData(fetchedGamesData);

            // Store the fetched data in sessionStorage
            sessionStorage.setItem("gamesData", JSON.stringify(fetchedGamesData));
        })();
    }, []);

    // Wait until gamesData is populated to render the page.
    if (gamesData.length === 0) return <div>Loading...</div>;

    return (
        <div className="trending-container">
            <h1 className="trending-head">TRENDING GAMES</h1>
            <div className="trending-featured1">
                <Link to={`/game?game_id=${gamesData[0].game.id}`}>
                    <Featured1
                        gameData={gamesData[0].game}
                        screenshots={gamesData[0].screenshotUrls}
                    />
                </Link>
            </div>
            {gamesData.slice(1).map((gameData, index) => (
                <Link key={index} to={`/game?game_id=${gameData.game.id}`}>
                    <Featured2
                        gameData={gameData.game}
                        screenshots={gameData.screenshotUrls}
                        limitSize={false}
                    />
                </Link>
            ))}
        </div>
    );
}

export default App;
