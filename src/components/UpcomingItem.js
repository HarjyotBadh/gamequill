import React from 'react'
import { Link } from 'react-router-dom';
import UpcomingCountdown from "./UpcomingCountdown"
import "../styles/UpcomingItem.css"

export default function UpcomingItem({ name, cover, gameid, ti, platform }) {
  const platformMapping = {
    3: "Linux",
    4: "Nintendo 64",
    5: "Wii",
    6: "PC (Microsoft Windows)",
    7: "PlayStation",
    8: "PlayStation 2",
    9: "PlayStation 3",
    11: "Xbox",
    12: "Xbox 360",
    13: "DOS",
    14: "Mac",
    15: "Commodore C64/128/MAX",
    16: "Amiga",
    18: "Nintendo Entertainment System",
    19: "Super Nintendo Entertainment System",
    20: "Nintendo DS",
    21: "Nintendo GameCube",
    22: "Game Boy Color",
    23: "Dreamcast",
    24: "Game Boy Advance",
    25: "Amstrad CPC",
    26: "ZX Spectrum",
    27: "MSX",
    29: "Sega Mega Drive/Genesis",
    30: "Sega 32X",
    32: "Sega Saturn",
    33: "Game Boy",
    34: "Android",
    35: "Sega Game Gear",
    37: "Nintendo 3DS",
    38: "PlayStation Portable",
    39: "iOS",
    41: "Wii U",
    42: "N-Gage",
    44: "Tapwave Zodiac",
    46: "PlayStation Vita",
    47: "Virtual Console",
    48: "PlayStation 4",
    49: "Xbox One",
    50: "3DO Interactive Multiplayer",
    51: "Family Computer Disk System",
    52: "Arcade",
    53: "MSX2",
    55: "Legacy Mobile Device",
    57: "WonderSwan",
    58: "Super Famicom",
    59: "Atari 2600",
    60: "Atari 7800",
    61: "Atari Lynx",
    62: "Atari Jaguar",
    63: "Atari ST/STE",
    64: "Sega Master System/Mark III",
    65: "Atari 8-bit",
    66: "Atari 5200",
    67: "Intellivision",
    68: "ColecoVision",
    69: "BBC Microcomputer System",
    70: "Vectrex",
    71: "Commodore VIC-20",
    72: "Ouya",
    73: "BlackBerry OS",
    74: "Windows Phone",
    75: "Apple II",
    77: "Sharp X1",
    78: "Sega CD",
    79: "Neo Geo MVS",
    80: "Neo Geo AES",
    82: "Web browser",
    84: "SG-1000",
    85: "Donner Model 30",
    86: "TurboGrafx-16/PC Engine",
    87: "Virtual Boy",
    88: "Odyssey",
    89: "Microvision",
    90: "Commodore PET",
    91: "Bally Astrocade",
    93: "Commodore 16",
    94: "Commodore Plus/4",
    95: "PDP-1",
    96: "PDP-10",
    97: "PDP-8",
    98: "DEC GT40",
    99: "Family Computer",
    100: "Analogue electronics",
    101: "Ferranti Nimrod Computer",
    102: "EDSAC",
    103: "PDP-7",
    104: "HP 2100",
    105: "HP 3000",
    106: "SDS Sigma 7",
    107: "Call-A-Computer time-shared mainframe computer system",
    108: "PDP-11",
    109: "CDC Cyber 70",
    110: "PLATO",
    111: "Imlac PDS-1",
    112: "Microcomputer",
    113: "OnLive Game System",
    114: "Amiga CD32",
    115: "Apple IIGS",
    116: "Acorn Archimedes",
    167: "PlayStation 5",
    169: "Xbox Series X|S",
    130: "Nintendo Switch",
  };
  return (
    <div>
      <Link to={`/game?game_id=${gameid}`}>
        <div class="upcoming-item">
          {cover ? (
            <img className="upcoming-cover-rounded" src={cover} alt="Game" />
          ) : (
            <p className="no-image-text">No image available</p>
          )}
          <UpcomingCountdown time={ti} />
          <div class="upcoming-platform text-black dark:text-white">
            {platformMapping[platform]}
          </div>
        </div>
      </Link>
    </div>
  );
}
