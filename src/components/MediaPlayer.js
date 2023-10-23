import React from 'react';
import { useState } from 'react';
import YouTube from 'react-youtube';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../styles/MediaPlayer.css';
import Popup from 'reactjs-popup';


const MediaPlayer = ({ screenshots, youtubeLinks }) => {
    const [open, setOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const closeModal = () => {
        setOpen(false);
        setSelectedImageIndex(null);
    };
    
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
          <>
              <Slider className="media-slider-container img" {...settings}>
                  {screenshots.map((screenshotURL, index) => (
                      <div key={index}>
                          <button onClick={() => {
                              setSelectedImageIndex(index);
                              setOpen(true);
                          }}>
                              <img
                                  src={screenshotURL}
                                  alt={`screenshot-${index}`}
                              />{" "}
                          </button>
                      </div>
                  ))}

                  {youtubeLinks.map((videoId) => (
                      <div key={videoId} className="youtube-video-wrapper">
                          <YouTube videoId={videoId} opts={opts} />
                      </div>
                  ))}
              </Slider>

              <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                  <div className="modal">
                      <a className="close" onClick={closeModal} href='Enlarged Screenshot'>
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


