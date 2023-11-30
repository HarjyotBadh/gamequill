import React from "react";
import "../styles/GenreIcon.css";
import genpac from "../images/genres/gq-genre-pointandclick.png";
import genfighting from "../images/genres/gq-genre-fighting.png";
import genshooter from "../images/genres/gq-genre-shooter.png";
import genmusic from "../images/genres/gq-genre-music.png";
import genplatform from "../images/genres/gq-genre-platformer.png";
import genpuzzle from "../images/genres/gq-genre-puzzle.png";
import genracing from "../images/genres/gq-genre-racing.png";
import genrts from "../images/genres/gq-genre-rts.png";
import genrpg from "../images/genres/gq-genre-rpg.png";
import gensim from "../images/genres/gq-genre-sim.png";
import gensport from "../images/genres/gq-genre-sport.png";
import genstrategy from "../images/genres/gq-genre-strategy.png";
import gentbs from "../images/genres/gq-genre-turnbased.png";
import gentactical from "../images/genres/gq-genre-tactical.png";
import genquiz from "../images/genres/gq-genre-quiztrivia.png";
import genhas from "../images/genres/gq-genre-hackandslash.png";
import genadventure from "../images/genres/gq-genre-adventure.png";
import genarcade from "../images/genres/gq-genre-arcade.png";
import gencards from "../images/genres/gq-genre-cards.png";
import genindie from "../images/genres/gq-genre-indie.png";
import genpinball from "../images/genres/gq-genre-pinball.png";

const genreImages = {
  "Real Time Strategy (RTS)": genrts,
  "Puzzle": genpuzzle,
  "Indie": genindie,
  "Pinball": genpinball,
  "Point-and-Click": genpac,
  "Fighting": genfighting,
  "Shooter": genshooter,
  "Music": genmusic,
  "Platform": genplatform,
  "Racing": genracing,
  "Role-playing (RPG)": genrpg,
  "Simulator": gensim,
  "Sport": gensport,
  "Strategy": genstrategy,
  "Turn-based Strategy (TBS)": gentbs,
  "Tactical": gentactical,
  "Quiz/Trivia": genquiz,
  "Hack and Slash/Beat 'em Up": genhas,
  "Adventure": genadventure,
  "Arcade": genarcade,
  "Card & Board Game": gencards,
};

export default function GenreIcon({ g }) {
  
  const genreImage = genreImages[g];

  return (
    <div>
      {genreImage ? <img class="genre-icon" src={genreImage} alt={`Genre: ${g}`} /> : <span>Genre not found</span>}
    </div>
  );
}