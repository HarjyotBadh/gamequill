import React from 'react';
import { useLocation } from 'react-router-dom';
import StarSelection from '../components/StarSelection';
import TitleCard from '../components/TitleCard';
import ReviewTextField from '../components/ReviewTextField';
import NavBar from '../components/NavBar';
import '../styles/ReviewCreationPage.css';

export default function ReviewCreationPage() {
  const location = useLocation();
  const gameData = location.state.gameData;

  const [darkMode, setDarkMode] = React.useState(
    () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  React.useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDarkMode(e.matches);
    matcher.addListener(onChange);
    return () => {
      matcher.removeListener(onChange);
    };
  }, []);

  return (
    <div className={`review-page-wrapper ${darkMode ? "dark" : "light"}`} data-theme={darkMode ? "dark" : "light"}>
      <NavBar />
      <div className="review-page-stuff">
        <TitleCard gameData={gameData} />

        <div className="review-content-container">
          <h1>Choose Rating</h1>
          <StarSelection />
          <ReviewTextField />
        </div>
      </div>
    </div>
  );
}
