import React from "react";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/MediaPlayer.css";
import Popup from "reactjs-popup";
import ReactPlayer from "react-player/youtube";

const MediaPlayer = ({ screenshots, youtubeLinks }) => {
    const [open, setOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const closeModal = () => {
        setOpen(false);
        setSelectedImageIndex(null);
    };

    // Options for the image slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adapativeHeight: false,
    };

    return (
        <>
            <Slider className="media-slider-container img" {...settings}>
                {screenshots.map((screenshotURL, index) => (
                    <div key={index}>
                        <button
                            onClick={() => {
                                setSelectedImageIndex(index);
                                setOpen(true);
                            }}
                        >
                            <img
                                src={screenshotURL}
                                alt={`screenshot-${index}`}
                            />
                        </button>
                    </div>
                ))}

                {youtubeLinks.map(
                    (videoId) =>
                        videoId && ( // Check if videoId is not null or undefined
                            <div
                                key={videoId}
                                className="youtube-video-wrapper"
                            >
                                <ReactPlayer
                                    className="video-container"
                                    url={`https://www.youtube.com/watch?v=${videoId}`}
                                    config={{
                                        youtube: {
                                            playerVars: { autoplay: 0 },
                                        },
                                    }}
                                />
                            </div>
                        )
                )}
            </Slider>

            <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                <div className="modal">
                    <a className="close" onClick={closeModal}>
                        &times;
                    </a>
                    {selectedImageIndex !== null && (
                        <img
                            src={screenshots[selectedImageIndex]}
                            alt={`screenshot-${selectedImageIndex}`}
                            className="enlarged-image"
                        />
                    )}
                </div>
            </Popup>
        </>
    );
};

export default MediaPlayer;
