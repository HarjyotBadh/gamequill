import React from "react";
import { Spinner } from "@material-tailwind/react";
import "../styles/DescriptionBox.css";
import xboxLogo from "../images/platform_logos/Xbox_logo.png";
import playstationLogo from "../images/platform_logos/PlayStation_Logo.png";
import nintendoLogo from "../images/platform_logos/Nintendo_logo.png";
import steamLogo from "../images/platform_logos/PC_logo.png";
import appleLogo from "../images/platform_logos/Apple_logo.png";
import androidLogo from "../images/platform_logos/Android_logo.png";
import RP_Image from "../images/esrb_logos/esrb_rp.png";
import EC_Image from "../images/esrb_logos/esrb_ec.png";
import E_Image from "../images/esrb_logos/esrb_everyone.png";
import E10_Image from "../images/esrb_logos/esrb_e10.png";
import T_Image from "../images/esrb_logos/esrb_t.png";
import M_Image from "../images/esrb_logos/esrb_m.png";
import AO_Image from "../images/esrb_logos/esrb_ao.png";

export default function DescriptionBox({ gameData }) {
  const [darkMode, setDarkMode] = React.useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  React.useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDarkMode(e.matches);

    matcher.addListener(onChange);

    return () => {
      matcher.removeListener(onChange);
    };
  }, []);

  if (!gameData) return <Spinner color="blue" />;

  // Get the game's summary, storyline, and genres.
  const summary = gameData.summary;
  const storyline = gameData.storyline;
  const genres = gameData.genres?.map((genre) => genre.name).join(", ");

  // Get the game's ESRB rating and description.
  const esrbAgeRating = gameData.age_ratings?.find(
    (rating) => rating.category === 1
  );
  const esrbRatingValue = esrbAgeRating?.rating;
  const esrbDetails = getESRBDetails(esrbRatingValue);
  const esrbDescription = esrbAgeRating?.content_descriptions
    ?.map((description) => description.description)
    .join(", ");

  // Get the ESRB rating image and description.
  function getESRBDetails(esrbRating) {
    switch (esrbRating) {
      case 6:
        return { image: RP_Image, description: "Rating Pending" };
      case 7:
        return { image: EC_Image, description: "Early Childhood" };
      case 8:
        return { image: E_Image, description: "Everyone" };
      case 9:
        return { image: E10_Image, description: "Everyone 10+" };
      case 10:
        return { image: T_Image, description: "Teen" };
      case 11:
        return { image: M_Image, description: "Mature 17+" };
      case 12:
        return { image: AO_Image, description: "Adults Only 18+" };
      default:
        return null;
    }
  }

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
    if (nameLower.includes("nintendo") && !inNintendo) {
      inNintendo = true;
      return (
        <a
          href="https://www.nintendo.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={nintendoLogo}
            alt="Nintendo Logo"
            className="platform-logo"
          />
        </a>
      );
    } else if (nameLower.includes("playstation") && !inPlaystation) {
      inPlaystation = true;
      return (
        <a
          href="https://www.playstation.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={playstationLogo}
            alt="PlayStation Logo"
            className="platform-logo"
          />
        </a>
      );
    } else if (nameLower.includes("xbox") && !inXbox) {
      inXbox = true;
      return (
        <a
          href="https://www.xbox.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={xboxLogo} alt="Xbox Logo" className="platform-logo" />
        </a>
      );
    } else if (nameLower.includes("pc") && !inSteam) {
      inSteam = true;
      return (
        <a
          href="https://store.steampowered.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={steamLogo} alt="Steam Logo" className="platform-logo" />
        </a>
      );
    } else if (nameLower.includes("ios") && !inApple) {
      inApple = true;
      return (
        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={appleLogo} alt="Apple Logo" className="platform-logo" />
        </a>
      );
    } else if (nameLower.includes("android") && !inAndroid) {
      inAndroid = true;
      return (
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={androidLogo} alt="Android Logo" className="platform-logo" />
        </a>
      );
    } else {
      return null;
    }
  };

    // Get the platforms.
    var platforms = gameData.platforms ? gameData.platforms.map(getPlatformLink) : null;

  return (
    <div>
      <div
        className={`description-box ${darkMode ? "dark" : "light"}`}
        data-theme={darkMode ? "dark" : "light"}
      >
        <h1> Summary </h1>
        <p>{summary}</p>
        <h1> Genres </h1>
        <p>{genres}</p>
        {storyline && <h1> Storyline </h1>}
        {storyline && <p>{storyline}</p>}
        <h1> Platforms </h1>
        <div className="platform-container">{platforms}</div>
        <h1> Age Rating </h1>
        {esrbDetails && (
          <>
            <img
              src={esrbDetails.image}
              alt={gameData.esrb_rating}
              className="esrb-image"
            />
            <p className="esrb-description">{esrbDescription}</p>
          </>
        )}
      </div>
    </div>
  );
}
