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
  "real time strategy (rts)": genrts,
  "puzzle": genpuzzle,
  "indie": genindie,
  "pinball": genpinball,
  "point-and-click": genpac,
  "fighting": genfighting,
  "shooter": genshooter,
  "music": genmusic,
  "platform": genplatform,
  "racing": genracing,
  "role-playing (rpg)": genrpg,
  "simulator": gensim,
  "sport": gensport,
  "strategy": genstrategy,
  "turn-based strategy (tbs)": gentbs,
  "tactical": gentactical,
  "quiz/trivia": genquiz,
  "hack and slash/beat 'em up": genhas,
  "adventure": genadventure,
  "arcade": genarcade,
  "card & board game": gencards,
};

export default function GenreIcon({ g }) {
  
  const genreImage = genreImages[g.toLowerCase()];

  return (
    <div>
      {genreImage ? <img class="a b" src={genreImage} alt={`Genre: ${g}`} /> : <span>Genre not found</span>}
    </div>
  );
}