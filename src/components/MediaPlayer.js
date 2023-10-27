import React from 'react';
import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../styles/MediaPlayer.css';
import Popup from 'reactjs-popup';


const MediaPlayer = ({ screenshots, youtubeLinks }) => {
    const [open, setOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [playerReady, setPlayerReady] = useState(false);
    const closeModal = () => {
        setOpen(false);
        setSelectedImageIndex(null);
    };
    const playerRef = useRef(null);  // Step 1: Ref to hold the YouTube player instance
    
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
        adapativeHeight: false,

      };

      const isMounted = useRef(true); // Step 1

    useEffect(() => {
        return () => {
            isMounted.current = false; // Step 2
        };
    }, []);

      return (
          <>
              <Slider className="media-slider-container img" {...settings}>
                {screenshots.map((screenshotURL, index) => (
                    <div key={index}>
                        <button onClick={() => {
                            setSelectedImageIndex(index);
                            setOpen(true);
                        }}>
                            <img src={screenshotURL} alt={`screenshot-${index}`} />
                        </button>
                    </div>
                ))}

                {youtubeLinks.map((videoId) => (
                    <div key={videoId} className="youtube-video-wrapper">
                        <YouTube 
                            videoId={videoId} 
                            opts={opts} 
                            onReady={(e) => {
                                if (isMounted.current) { 
                                    setPlayerReady(true);
                                    playerRef.current = e.target;
                                }
                            }}
                        />
                    </div>
                ))}
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


