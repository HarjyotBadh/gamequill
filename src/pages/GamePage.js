import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import MediaPlayer from "../components/MediaPlayer";
import DescriptionBox from "../components/DescriptionBox";
import '../styles/GamePage.css';

export default function GamePage({game_id}) {
    const [gameData, setGameData] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [videos, setVideos] = useState([]);

    const sample_id = 96437;
    // Cyberpunk 2077: 1877
    // ToTK: 119388
    // Starfield: 96437
    // Minecraft: 135400
    // Skyrim: 165192

    game_id = sample_id;
    
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
                fields name,cover.url,involved_companies.company.name,rating,aggregated_rating,screenshots.url,videos.video_id,genres.name,summary,storyline,platforms.name;
                    where id = ${game_id};
                    `

            })
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    const game = data[0];
                    setGameData(game);
                
                    // Get screenshots URLs
                    const screenshotUrls = game.screenshots ? game.screenshots.map(s => s.url.replace('t_thumb', 't_1080p')) : [];
                    setScreenshots(screenshotUrls);

                    // Get video IDs
                    const videoIds = game.videos ? game.videos.map(v => v.video_id) : [];
                    setVideos(videoIds);

                    console.log("summary: " + screenshotUrls);

                }
                
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id]);


    // @TODO: When requesting the similar games data, that can all be done through one request to IGDB.
    //        You can send an array of IDs to the API, and that will return all the games.
    //        Ex:   (ID1, ID2, ID3)      - See Mulitple Game Request
    return (
        <div className="game-page-wrapper">
            <NavBar />
    
            <div className="game-content-container">
                <div className="left-content">
                    <TitleCard gameData={gameData} />
                    <MediaPlayer screenshots={screenshots} youtubeLinks={videos} />
                </div>
    
                <div className="right-content">
                     <DescriptionBox gameData={gameData} />
                </div>
            </div>
        </div>
    );
    
    
    
    
}
