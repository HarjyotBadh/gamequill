import React from "react";
import "../styles/TitleCard.css";

export default function TitleCard({ gameData }) {
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

    if (!gameData) return <div>Loading...</div>;

    const bigCoverUrl = gameData.cover
        ? gameData.cover.url.replace("/t_thumb/", "/t_cover_big/")
        : null;
    const textSizeClass = gameData.name.length > 25 ? "text-xl" : "text-4xl";
    // const esrbRating = gameData.age_ratings?.[0]?.rating;
    // const esrbDetails = getESRBDetails(esrbRating);

    // @TODO: Replace rating with our rating system.
    var rating = gameData.aggregated_rating;
    const starAverage = rating ? rating / 20 : 0; // Convert to a scale of 5
    const fullStars = Math.floor(starAverage);
    const starArr = [];

    // Create an array of stars
    for (let i = 1; i <= fullStars; i++) {
        starArr.push(1);
    }

    // Add a partial star if needed
    if (starAverage < 5) {
        const partialStar = starAverage - fullStars;
        starArr.push(partialStar);
        const emptyStars = 5 - starArr.length;
        for (let i = 1; i <= emptyStars; i++) {
            starArr.push(0);
        }
    }

    // Convert the array of stars to JSX
    const stars = starArr.map((val, i) => {
        if (val === 1)
            return (
                <span key={i} className="fullStar">
                    ★
                </span>
            );
        else if (val > 0)
            return (
                <span key={i} className="halfStar">
                    ★
                </span>
            );
        else
            return (
                <span key={i} className="emptyStar">
                    ★
                </span>
            );
    });

    return (
        <div
            className={`game-card ${darkMode ? "dark" : "light"}`}
            data-theme={darkMode ? "dark" : "light"}
        >
            {bigCoverUrl && <img src={bigCoverUrl} alt={gameData.name} />}
            <h2 className={textSizeClass}>{gameData.name}</h2>
            <p>{gameData.involved_companies?.[0]?.company?.name || "N/A"}</p>
            <p className="numericRating">{starAverage.toFixed(1)}</p>
            <div className="rating">{stars}</div>
        </div>
    );
}
