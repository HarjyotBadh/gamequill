import React from 'react';
import YouTube from 'react-youtube';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../styles/MediaPlayer.css';


const MediaPlayer = ({ screenshots, youtubeLinks }) => {
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0,
        },
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,

      };

    return (
        <Slider {...settings}>
            {screenshots.map((screenshotURL, index) => (
                <div key={index}>
                    <img src={screenshotURL} alt={`screenshot-${index}`} width="50%" />
                </div>
            ))}

            {youtubeLinks.map((videoId, index) => (
                <div key={videoId}>
                    <YouTube videoId={videoId} opts={opts} />
                </div>
            ))}
        </Slider>
    );
};

export default MediaPlayer;
