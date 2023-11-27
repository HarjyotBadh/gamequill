import React from "react";
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

export default function GenreIcon({ g }) {
  var ispac = false;
  var isfighting = false;
  var isshooter = false;
  var ismusic = false;
  var isplatform = false;
  var ispuzzle = false;
  var isracing = false;
  var isrts = false;
  var isrpg = false;
  var issim = false;
  var issport = false;
  var isstrategy = false;
  var istbs = false;
  var istactical = false;
  var isquiz = false;
  var ishas = false;
  var isadventure = false;
  var isarcade = false;
  var iscards = false;

  if (g == "Point-and-Click") {
    ispac = true;
  }
  if (g == "Fighting") {
    isfighting = true;
  }
  if (g == "Shooter") {
    isshooter = true;
  }
  if (g == "Music") {
    ismusic = true;
  }
  if (g == "Platform") {
    isplatform = true;
  }
  if (g == "Racing") {
    isracing = true;
  }
  if (g == "Role-playing (RPG)") {
    isrpg = true;
  }
  if (g == "Simulator") {
    issim = true;
  }
  if (g == "Sport") {
    issport = true;
  }
  if (g == "Strategy") {
    isstrategy = true;
  }
  if (g == "Turn-based Strategy (TBS)") {
    istbs = true;
  }
  if (g == "Tactical") {
    istactical = true;
  }
  if (g == "Quiz/Trivia") {
    isquiz = true;
  }
  if (g == "Hack and Slash/Beat 'em Up") {
    ishas = true;
  }
  if (g == "Adventure") {
    isadventure = true;
  }
  if (g == "Arcade") {
    isarcade = true;
  }
  if (g == "Card & Board Game") {
    iscards = true;
  }
  if (g == "Puzzle") {
    ispuzzle = true;
  }

  return (
    <div>
      {ispac ? <img src={genpac} alt="Genre" /> : <img />}
      {isfighting ? <img src={genfighting} alt="Genre" /> : <img />}
      {isshooter ? <img src={genshooter} alt="Genre" /> : <img />}
      {ismusic ? <img src={genmusic} alt="Genre" /> : <img />}
      {isplatform ? <img src={genplatform} alt="Genre" /> : <img />}
      {isracing ? <img src={genracing} alt="Genre" /> : <img />}
      {isrpg ? <img src={genrpg} alt="Genre" /> : <img />}
      {issim ? <img src={gensim} alt="Genre" /> : <img />}
      {issport ? <img src={gensport} alt="Genre" /> : <img />}
      {isstrategy ? <img src={genstrategy} alt="Genre" /> : <img />}
      {istbs ? <img src={gentbs} alt="Genre" /> : <img />}
      {istactical ? <img src={gentactical} alt="Genre" /> : <img />}
      {isquiz ? <img src={genquiz} alt="Genre" /> : <img />}
      {ishas ? <img src={genhas} alt="Genre" /> : <img />}
      {isadventure ? <img src={genadventure} alt="Genre" /> : <img />}
      {isarcade ? <img src={genarcade} alt="Genre" /> : <img />}
      {iscards ? <img src={gencards} alt="Genre" /> : <img />}
    </div>
  );
}