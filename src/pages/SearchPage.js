import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TitleCard from "../components/TitleCard";
import { Link } from "react-router-dom";
import "../styles/SearchPage.css";
import GameColumn from "../components/GamesColumn";
import UserColumn from "../components/UserColumn";
import { db } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Footer from "../components/Footer";

const SearchPage = ({ searchQuery }) => {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const genreMapping = {
    fighting: 4,
    shooter: 5,
    music: 7,
    platform: 8,
    puzzle: 9,
    racing: 10,
    "real-time-strategy": 11,
    "role-playing": 12,
    simulator: 13,
    sport: 14,
    strategy: 15,
    "turn-based-strategy": 16,
    tactical: 24,
    "quiz-trivia": 26,
    "hack-and-slash-beat-em-up": 25,
    pinball: 30,
    adventure: 31,
    arcade: 33,
    "visual-novel": 34,
    indie: 32,
    "card-board-game": 35,
    moba: 36,
    "point-and-click": 2,
  };
  const gameGenres = [
    { value: "point-and-click", label: "Point-and-Click" },
    { value: "fighting", label: "Fighting" },
    { value: "shooter", label: "Shooter" },
    { value: "music", label: "Music" },
    { value: "platform", label: "Platform" },
    { value: "puzzle", label: "Puzzle" },
    { value: "racing", label: "Racing" },
    { value: "real-time-strategy", label: "Real Time Strategy (RTS)" },
    { value: "role-playing", label: "Role-playing (RPG)" },
    { value: "simulator", label: "Simulator" },
    { value: "sport", label: "Sport" },
    { value: "strategy", label: "Strategy" },
    { value: "turn-based-strategy", label: "Turn-based Strategy (TBS)" },
    { value: "tactical", label: "Tactical" },
    { value: "quiz-trivia", label: "Quiz/Trivia" },
    { value: "hack-and-slash-beat-em-up", label: "Hack and Slash/Beat 'em Up" },
    { value: "pinball", label: "Pinball" },
    { value: "adventure", label: "Adventure" },
    { value: "arcade", label: "Arcade" },
    { value: "visual-novel", label: "Visual Novel" },
    { value: "indie", label: "Indie" },
    { value: "card-board-game", label: "Card & Board Game" },
    { value: "moba", label: "MOBA" },
  ];
  const platformMapping = {
    Linux: 3,
    "Nintendo 64": 4,
    Wii: 5,
    "PC (Microsoft Windows)": 6,
    PlayStation: 7,
    "PlayStation 2": 8,
    "PlayStation 3": 9,
    Xbox: 11,
    "Xbox 360": 12,
    DOS: 13,
    Mac: 14,
    "Commodore C64/128/MAX": 15,
    Amiga: 16,
    "Nintendo Entertainment System": 18,
    "Super Nintendo Entertainment System": 19,
    "Nintendo DS": 20,
    "Nintendo GameCube": 21,
    "Game Boy Color": 22,
    Dreamcast: 23,
    "Game Boy Advance": 24,
    "Amstrad CPC": 25,
    "ZX Spectrum": 26,
    MSX: 27,
    "Sega Mega Drive/Genesis": 29,
    "Sega 32X": 30,
    "Sega Saturn": 32,
    "Game Boy": 33,
    Android: 34,
    "Sega Game Gear": 35,
    "Nintendo 3DS": 37,
    "PlayStation Portable": 38,
    iOS: 39,
    "Wii U": 41,
    "N-Gage": 42,
    "Tapwave Zodiac": 44,
    "PlayStation Vita": 46,
    "Virtual Console": 47,
    "PlayStation 4": 48,
    "Xbox One": 49,
    "3DO Interactive Multiplayer": 50,
    "Family Computer Disk System": 51,
    Arcade: 52,
    MSX2: 53,
    "Legacy Mobile Device": 55,
    WonderSwan: 57,
    "Super Famicom": 58,
    "Atari 2600": 59,
    "Atari 7800": 60,
    "Atari Lynx": 61,
    "Atari Jaguar": 62,
    "Atari ST/STE": 63,
    "Sega Master System/Mark III": 64,
    "Atari 8-bit": 65,
    "Atari 5200": 66,
    Intellivision: 67,
    ColecoVision: 68,
    "BBC Microcomputer System": 69,
    Vectrex: 70,
    "Commodore VIC-20": 71,
    Ouya: 72,
    "BlackBerry OS": 73,
    "Windows Phone": 74,
    "Apple II": 75,
    "Sharp X1": 77,
    "Sega CD": 78,
    "Neo Geo MVS": 79,
    "Neo Geo AES": 80,
    "Web browser": 82,
    "SG-1000": 84,
    "Donner Model 30": 85,
    "TurboGrafx-16/PC Engine": 86,
    "Virtual Boy": 87,
    Odyssey: 88,
    Microvision: 89,
    "Commodore PET": 90,
    "Bally Astrocade": 91,
    "Commodore 16": 93,
    "Commodore Plus/4": 94,
    "PDP-1": 95,
    "PDP-10": 96,
    "PDP-8": 97,
    "DEC GT40": 98,
    "Family Computer": 99,
    "Analogue electronics": 100,
    "Ferranti Nimrod Computer": 101,
    EDSAC: 102,
    "PDP-7": 103,
    "HP 2100": 104,
    "HP 3000": 105,
    "SDS Sigma 7": 106,
    "Call-A-Computer time-shared mainframe computer system": 107,
    "PDP-11": 108,
    "CDC Cyber 70": 109,
    PLATO: 110,
    "Imlac PDS-1": 111,
    Microcomputer: 112,
    "OnLive Game System": 113,
    "Amiga CD32": 114,
    "Apple IIGS": 115,
    "Acorn Archimedes": 116,
  };

  const gamePlatforms = [
    { value: "Linux", label: "Linux" },
    { value: "Nintendo 64", label: "Nintendo 64" },
    { value: "Wii", label: "Wii" },
    { value: "PC (Microsoft Windows)", label: "PC (Microsoft Windows)" },
    { value: "PlayStation", label: "PlayStation" },
    { value: "PlayStation 2", label: "PlayStation 2" },
    { value: "PlayStation 3", label: "PlayStation 3" },
    { value: "Xbox", label: "Xbox" },
    { value: "Xbox 360", label: "Xbox 360" },
    { value: "DOS", label: "DOS" },
    { value: "Mac", label: "Mac" },
    { value: "Commodore C64/128/MAX", label: "Commodore C64/128/MAX" },
    { value: "Amiga", label: "Amiga" },
    {
      value: "Nintendo Entertainment System",
      label: "Nintendo Entertainment System",
    },
    {
      value: "Super Nintendo Entertainment System",
      label: "Super Nintendo Entertainment System",
    },
    { value: "Nintendo DS", label: "Nintendo DS" },
    { value: "Nintendo GameCube", label: "Nintendo GameCube" },
    { value: "Game Boy Color", label: "Game Boy Color" },
    { value: "Dreamcast", label: "Dreamcast" },
    { value: "Game Boy Advance", label: "Game Boy Advance" },
    { value: "Amstrad CPC", label: "Amstrad CPC" },
    { value: "ZX Spectrum", label: "ZX Spectrum" },
    { value: "MSX", label: "MSX" },
    { value: "Sega Mega Drive/Genesis", label: "Sega Mega Drive/Genesis" },
    { value: "Sega 32X", label: "Sega 32X" },
    { value: "Sega Saturn", label: "Sega Saturn" },
    { value: "Game Boy", label: "Game Boy" },
    { value: "Android", label: "Android" },
    { value: "Sega Game Gear", label: "Sega Game Gear" },
    { value: "Nintendo 3DS", label: "Nintendo 3DS" },
    { value: "PlayStation Portable", label: "PlayStation Portable" },
    { value: "iOS", label: "iOS" },
    { value: "Wii U", label: "Wii U" },
    { value: "N-Gage", label: "N-Gage" },
    { value: "Tapwave Zodiac", label: "Tapwave Zodiac" },
    { value: "PlayStation Vita", label: "PlayStation Vita" },
    { value: "Virtual Console", label: "Virtual Console" },
    { value: "PlayStation 4", label: "PlayStation 4" },
    { value: "Xbox One", label: "Xbox One" },
    {
      value: "3DO Interactive Multiplayer",
      label: "3DO Interactive Multiplayer",
    },
    {
      value: "Family Computer Disk System",
      label: "Family Computer Disk System",
    },
    { value: "Arcade", label: "Arcade" },
    { value: "MSX2", label: "MSX2" },
    { value: "Legacy Mobile Device", label: "Legacy Mobile Device" },
    { value: "WonderSwan", label: "WonderSwan" },
    { value: "Super Famicom", label: "Super Famicom" },
    { value: "Atari 2600", label: "Atari 2600" },
    { value: "Atari 7800", label: "Atari 7800" },
    { value: "Atari Lynx", label: "Atari Lynx" },
    { value: "Atari Jaguar", label: "Atari Jaguar" },
    { value: "Atari ST/STE", label: "Atari ST/STE" },
    {
      value: "Sega Master System/Mark III",
      label: "Sega Master System/Mark III",
    },
    { value: "Atari 8-bit", label: "Atari 8-bit" },
    { value: "Atari 5200", label: "Atari 5200" },
    { value: "Intellivision", label: "Intellivision" },
    { value: "ColecoVision", label: "ColecoVision" },
    { value: "BBC Microcomputer System", label: "BBC Microcomputer System" },
    { value: "Vectrex", label: "Vectrex" },
    { value: "Commodore VIC-20", label: "Commodore VIC-20" },
    { value: "Ouya", label: "Ouya" },
    { value: "BlackBerry OS", label: "BlackBerry OS" },
    { value: "Windows Phone", label: "Windows Phone" },
    { value: "Apple II", label: "Apple II" },
    { value: "Sharp X1", label: "Sharp X1" },
    { value: "Sega CD", label: "Sega CD" },
    { value: "Neo Geo MVS", label: "Neo Geo MVS" },
    { value: "Neo Geo AES", label: "Neo Geo AES" },
    { value: "Web browser", label: "Web browser" },
    { value: "SG-1000", label: "SG-1000" },
    { value: "Donner Model 30", label: "Donner Model 30" },
    { value: "TurboGrafx-16/PC Engine", label: "TurboGrafx-16/PC Engine" },
    { value: "Virtual Boy", label: "Virtual Boy" },
    { value: "Odyssey", label: "Odyssey" },
    { value: "Microvision", label: "Microvision" },
    { value: "Commodore PET", label: "Commodore PET" },
    { value: "Bally Astrocade", label: "Bally Astrocade" },
    { value: "Commodore 16", label: "Commodore 16" },
    { value: "Commodore Plus/4", label: "Commodore Plus/4" },
    { value: "PDP-1", label: "PDP-1" },
    { value: "PDP-10", label: "PDP-10" },
    { value: "PDP-8", label: "PDP-8" },
    { value: "DEC GT40", label: "DEC GT40" },
    { value: "Family Computer", label: "Family Computer" },
    { value: "Analogue electronics", label: "Analogue electronics" },
    { value: "Ferranti Nimrod Computer", label: "Ferranti Nimrod Computer" },
    { value: "EDSAC", label: "EDSAC" },
    { value: "PDP-7", label: "PDP-7" },
    { value: "HP 2100", label: "HP 2100" },
    { value: "HP 3000", label: "HP 3000" },
    { value: "SDS Sigma 7", label: "SDS Sigma 7" },
    {
      value: "Call-A-Computer time-shared mainframe computer system",
      label: "Call-A-Computer time-shared mainframe computer system",
    },
    { value: "PDP-11", label: "PDP-11" },
    { value: "CDC Cyber 70", label: "CDC Cyber 70" },
    { value: "PLATO", label: "PLATO" },
    { value: "Imlac PDS-1", label: "Imlac PDS-1" },
    { value: "Microcomputer", label: "Microcomputer" },
    { value: "OnLive Game System", label: "OnLive Game System" },
    { value: "Amiga CD32", label: "Amiga CD32" },
    { value: "Apple IIGS", label: "Apple IIGS" },
    { value: "Acorn Archimedes", label: "Acorn Archimedes" },
  ];

  const searchGames = async () => {
    try {
      const corsAnywhereUrl = "http://localhost:8080/";
      const apiUrl = "https://api.igdb.com/v4/games";

      var genreNumber = null;
      if (selectedGenre != "") {
        genreNumber = genreMapping[selectedGenre];
      }
      var platformNumber = null;
      if (selectedPlatform != "") {
        platformNumber = platformMapping[selectedPlatform];
      }
      console.log(platformNumber);

      const response = await fetch(corsAnywhereUrl + apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
          Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
        },
        body: `search "${searchQuery}";fields name, cover.url, aggregated_rating, involved_companies.company.name; limit:50; where category = (0,8,9)${
          genreNumber ? ` & genres = (${genreNumber})` : ""
        }${platformNumber ? ` & platforms = (${platformNumber})` : ""};`,
      });

      const data = await response.json();
      if (data.length) {
        const gamesData = data.map((game) => ({
          id: game.id,
          gameData: {
            ...game,
            aggregated_rating: game.aggregated_rating || 0, // Set to 0 if aggregated_rating is undefined
          },
        }));
        gamesData.sort(
          (a, b) => b.gameData.aggregated_rating - a.gameData.aggregated_rating
        );
        console.log(gamesData);
        setGames(gamesData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchUsers = async () => {
    try {
      const userResults = [];

      const usersCollection = collection(db, "profileData");
      const q = query(
        usersCollection,
        where("usernameLowerCase", ">=", searchQuery.toLowerCase()),
        where("usernameLowerCase", "<=", searchQuery.toLowerCase() + "\uf8ff"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userResults.push({
          username: userData.username,
          userId: doc.id,
        });
      });

      setUsers(userResults);
      // console.log(users[0].username);
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      searchGames();
      searchUsers();
    }
  }, [searchQuery, selectedGenre, selectedPlatform]);

  const handleGenreChange = (event) => {
    if (event.target.value === "All Genres") {
      setSelectedGenre("");
    }
    setSelectedGenre(event.target.value);
  };
  const handlePlatformChange = (event) => {
    if (event.target.value === "All Platforms") {
      setSelectedPlatform("");
    }
    setSelectedPlatform(event.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-500">
      <NavBar />
      <div className="searchPageTitle" textAlign="center">
        <h1 className="text-4xl dark:text-white text-black">
          Search results for "{searchQuery}"
        </h1>
        <div className="headingsGameUser dark:text-white text-black">
          <h2>Games</h2>
          <h2>Users</h2>
        </div>
      </div>
      <div className="filterContainer">
        <div className="genreContainer flex flex-col">
          <label className="genreLabel" htmlFor="genre">
            Select Genre:
          </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={handleGenreChange}
            className="filterSelect"
          >
            <option value="">All Genres</option>
            {gameGenres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
        <div className="platformContainer flex flex-col">
          <label className="platformLabel" htmlFor="platform">
            Select Platform:
          </label>
          <select
            id="platform"
            value={selectedPlatform}
            onChange={handlePlatformChange}
            className="filterSelect"
          >
            <option value="">All Platforms</option>
            {gamePlatforms.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="searchContainer bg-white dark:bg-gray-500">
        <div className="resultsContainer bg-white dark:bg-gray-500">
          <GameColumn games={games} />
          <UserColumn users={users} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
