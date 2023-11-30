import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
import GenreIcon from "./GenreIcon";
import { Tooltip } from "@mui/material";

export default function DescriptionBox({ gameData }) {
    if (!gameData) return <Spinner color="blue" />;

    // Get the game's summary, storyline, and genres.
    const summary = gameData.summary;
    const storyline = gameData.storyline;

    // Get the game's ESRB rating and description.
    const esrbAgeRating = gameData.age_ratings?.find((rating) => rating.category === 1);
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

    const getPlatformPrice = (platform) => {
        switch (platform.toLowerCase()) {
            case "xbox":
                return gameData.xbox_game_price?.price.finalPrice;
            case "playstation":
                return gameData.playstation_game_price?.price.finalPrice;
            case "steam":
                return gameData.steam_game_price?.price.finalPrice;
            default:
                return null;
        }
    };

    // Get the correct platform n' link.
    const getPlatformLink = (platform) => {
        const nameLower = platform.name.toLowerCase();
        var price = null;
        var url = null;

        if (nameLower.includes("nintendo") && !inNintendo) {
            inNintendo = true;
            price = getPlatformPrice("nintendo");
            return (
                <Box textAlign="center">
                    <a href="https://www.nintendo.com/" target="_blank" rel="noopener noreferrer">
                        <img src={nintendoLogo} alt="Nintendo Logo" className="platform-logo" />
                    </a>
                    {/* No price for Nintendo as per the current data structure */}
                </Box>
            );
        } else if (nameLower.includes("playstation") && !inPlaystation) {
            inPlaystation = true;
            price = getPlatformPrice("playstation");
            // If price is not null, then set url to the playstation url.
            // Otherwise, set url to null.
            if (price) {
                url = gameData.playstation_game_price.url;
            } else {
                url = "https://www.playstation.com/";
            }
            return (
                <Box textAlign="center">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <img
                            src={playstationLogo}
                            alt="PlayStation Logo"
                            className="platform-logo"
                        />
                    </a>
                    {price && <Typography variant="body2">{`${price}`}</Typography>}
                </Box>
            );
        } else if (nameLower.includes("xbox") && !inXbox) {
            inXbox = true;
            price = getPlatformPrice("xbox");
            if (price) {
                url = gameData.xbox_game_price.url;
            } else {
                url = "https://www.xbox.com/";
            }
            return (
                <Box textAlign="center">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <img src={xboxLogo} alt="Xbox Logo" className="platform-logo" />
                    </a>
                    {price && <Typography variant="body2">{`${price}`}</Typography>}
                </Box>
            );
        } else if (nameLower.includes("pc") && !inSteam) {
            inSteam = true;
            price = getPlatformPrice("steam");

            if (price) {
                url = gameData.steam_game_price.url;
            } else {
                url = "https://store.steampowered.com/";
            }

            return (
                <Box textAlign="center">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <img src={steamLogo} alt="Steam Logo" className="platform-logo" />
                    </a>
                    {price && <Typography variant="body2">{`${price}`}</Typography>}
                </Box>
            );
        } else if (nameLower.includes("ios") && !inApple) {
            inApple = true;
            return (
                <Box textAlign="center">
                    <a
                        href="https://www.apple.com/app-store/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={appleLogo} alt="Apple Logo" className="platform-logo" />
                    </a>
                    {/* No price for Apple as per the current data structure */}
                </Box>
            );
        } else if (nameLower.includes("android") && !inAndroid) {
            inAndroid = true;
            return (
                <Box textAlign="center">
                    <a
                        href="https://play.google.com/store"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={androidLogo} alt="Android Logo" className="platform-logo" />
                    </a>
                    {/* No price for Android as per the current data structure */}
                </Box>
            );
        } else {
            return null;
        }
    };

    // Get the platforms.
    var platforms = gameData.platforms ? gameData.platforms.map(getPlatformLink) : null;

    return (
        <div>
            <div className={`description-box`}>
                <h1> Summary </h1>
                <p>{summary}</p>
                <h1> Genres </h1>
                <div class="description-genre">
                    {gameData.genres?.map((gen, index) => (
                        <div key={index} class="description-genre-icon">
                            <div class="description-genre-text">{gen.name}</div>
                                <div class="description-genre-image">
                                    <GenreIcon g={gen.name} />
                                </div>
                        </div>
                    ))}
                </div>

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
