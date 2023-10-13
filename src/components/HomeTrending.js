import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import "../styles/HomeTrending.css";
import Featured1 from "./Featured1";
import Featured2 from "./Featured2";

function App() {
    const [gameData0, setGameData0] = useState(null);
    const [screenshots0, setScreenshots0] = useState([]);
    const [gameData1, setGameData1] = useState(null);
    const [screenshots1, setScreenshots1] = useState([]);
    const [gameData2, setGameData2] = useState(null);
    const [screenshots2, setScreenshots2] = useState([]);
    const [gameData3, setGameData3] = useState(null);
    const [screenshots3, setScreenshots3] = useState([]);
    const [gameData4, setGameData4] = useState(null);
    const [screenshots4, setScreenshots4] = useState([]);




    const game_ids = [96437, 148241, 242408, 233307, 78511];

    useEffect(() => {
        const corsAnywhereUrl = "http://localhost:8080/";
        const apiUrl = "https://api.igdb.com/v4/games";
        fetch(
            corsAnywhereUrl + apiUrl,
            { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': '71i4578sjzpxfnbzejtdx85rek70p6',
                    'Authorization': 'Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp',
                },
                body: `
                    fields name,involved_companies.company.name,screenshots.url,cover.url,rating,aggregated_rating,id;
                    where id = (${game_ids.join(',')});
                `
            })
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    const game0 = data.find(game => game.id === game_ids[0]);
                    setGameData0(game0);
                    const screenshotUrls0 = game0.screenshots ? game0.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots0(screenshotUrls0);

                    const game1 = data.find(game => game.id === game_ids[1]);
                    setGameData1(game1);
                    const screenshotUrls1 = game1.screenshots ? game1.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots1(screenshotUrls1);

                    const game2 = data.find(game => game.id === game_ids[2]);
                    setGameData2(game2);
                    const screenshotUrls2 = game2.screenshots ? game2.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots2(screenshotUrls2);

                    const game3 = data.find(game => game.id === game_ids[3]);
                    setGameData3(game3);
                    const screenshotUrls3 = game3.screenshots ? game3.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots3(screenshotUrls3);

                    const game4 = data.find(game => game.id === game_ids[4]);
                    setGameData4(game4);
                    const screenshotUrls4 = game4.screenshots ? game4.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots4(screenshotUrls4);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    // If gameData0 is null, wait until it's not null to render the page.
    if (!gameData0) return <div>Loading...</div>;

    return (
        <div class="trending-container">
            <h1 class="trending-head">TRENDING GAMES</h1>
            <div class="trending-featured1">
                <Link to={`/game?game_id=${gameData0.id}`}>
                    <Featured1 gameData={gameData0} screenshots={screenshots0} />
                </Link>
            </div>
            <Link to={`/game?game_id=${gameData1.id}`}>
                <Featured2 gameData={gameData1} screenshots={screenshots1} />
            </Link>
            <Link to={`/game?game_id=${gameData2.id}`}>
                <Featured2 gameData={gameData2} screenshots={screenshots2} />
            </Link>
            <Link to={`/game?game_id=${gameData3.id}`}>
                <Featured2 gameData={gameData3} screenshots={screenshots3} />
            </Link>
            <Link to={`/game?game_id=${gameData4.id}`}>
                <Featured2 gameData={gameData4} screenshots={screenshots4} />
            </Link>
        </div>
    );
  }
  export default App;