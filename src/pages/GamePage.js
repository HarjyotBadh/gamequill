import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import MediaPlayer from "../components/MediaPlayer";

export default function GamePage({game_id}) {
    const [gameData, setGameData] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [videos, setVideos] = useState([]);

    const sample_id = 96437;
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
                    fields name,cover.url,involved_companies.company.name,rating,aggregated_rating,screenshots.url,videos.video_id;
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

                    // Console log the screenshots and videos
                    console.log(screenshotUrls);
                    console.log(videoIds);
                }
                
            })
            .catch(err => {
                console.error(err);
            });
    }, [game_id]);


    return (
        <div>
            <NavBar />
            <TitleCard gameData={gameData} />

            <MediaPlayer screenshots={screenshots} youtubeLinks={videos} />

        </div>
    )
}
