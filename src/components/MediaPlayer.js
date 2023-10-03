import React from 'react';
import YouTube from 'react-youtube';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../styles/MediaPlayer.css';

const MediaPlayer = ({ screenshots, youtubeLinks }) => {
    // Options for the YouTube player
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
        
    };

    // Options for the image slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,

      };

      return (
        <Slider className='media-slider-container img'{...settings}>
            {screenshots.map((screenshotURL, index) => (
                <div key={index}>
                    <img src={screenshotURL} alt={`screenshot-${index}`} />
                </div>
            ))}
    
            {youtubeLinks.map((videoId, index) => (
                <div key={videoId} className="youtube-video-wrapper">
                    <YouTube videoId={videoId} opts={opts} />
                </div>
            ))}
        </Slider>
    );
    
};

export default MediaPlayer;
