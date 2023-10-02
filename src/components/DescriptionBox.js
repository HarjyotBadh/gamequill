import React from 'react';
import '../styles/DescriptionBox.css';
import xboxLogo from '../images/platform_logos/Xbox_logo.png';
import playstationLogo from '../images/platform_logos/PlayStation_Logo.png';
import nintendoLogo from '../images/platform_logos/Nintendo_logo.png';
import steamLogo from '../images/platform_logos/PC_logo.png';
import appleLogo from '../images/platform_logos/Apple_logo.png';
import androidLogo from '../images/platform_logos/Android_logo.png'

export default function DescriptionBox({ gameData }) {
  if (!gameData) return <div>Loading...</div>;

  const summary = gameData.summary;
  const storyline = gameData.storyline;
  const genres = gameData.genres?.map((genre) => genre.name).join(", ");

  // Variables to help check if we've already added the platform logo.
  var inXbox = false;
  var inPlaystation = false;
  var inNintendo = false;
  var inSteam = false;
  var inApple = false;
  var inAndroid = false;

  // Get the correct platform n' link.
  const getPlatformLink = (platform) => {
    const nameLower = platform.name.toLowerCase();

    // Check which platform it is and return the correct one.
    if (nameLower.includes('nintendo') && !inNintendo) {
        inNintendo = true;
        return <a href="https://www.nintendo.com/" target="_blank" rel="noopener noreferrer">
          <img src={nintendoLogo} alt="Nintendo Logo" className="platform-logo" />
        </a>;
    } else if (nameLower.includes('playstation') && !inPlaystation) {
        inPlaystation = true;
        return <a href="https://www.playstation.com/" target="_blank" rel="noopener noreferrer">
            <img src={playstationLogo} alt="PlayStation Logo" className="platform-logo" />
        </a>;
    } else if (nameLower.includes('xbox') && !inXbox) {
        inXbox = true;
        return <a href="https://www.xbox.com/" target="_blank" rel="noopener noreferrer">
            <img src={xboxLogo} alt="Xbox Logo" className="platform-logo" />
        </a>;
    } else if (nameLower.includes('pc') && !inSteam) {
        inSteam = true;
        return <a href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer">
            <img src={steamLogo} alt="Steam Logo" className="platform-logo" />
        </a>;
    } else if (nameLower.includes('ios') && !inApple) {
        inApple = true;
        return <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
            <img src={appleLogo} alt="Apple Logo" className="platform-logo" />
        </a>;
    } else if (nameLower.includes('android') && !inAndroid) {
        inAndroid = true;
        return <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
            <img src={androidLogo} alt="Android Logo" className="platform-logo" />
        </a>;
    
    } else {
        return null;
    }
};


  const platforms = gameData.platforms.map(getPlatformLink);

  return (
    <div className="description-box">
        <h1> Summary </h1>
        <p>{summary}</p>
        <h1> Genres </h1>
        <p>{genres}</p>
        {storyline && <h1> Storyline </h1>}
        {storyline && <p>{storyline}</p>}
        <h1> Platforms </h1>
        <div className="platform-container">{platforms}</div>
    </div>
)
}
