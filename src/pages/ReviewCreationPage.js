import React from 'react';
import StarSelection from '../components/StarSelection';
import NavBar from '../components/NavBar';
import '../styles/ReviewCreationPage.css';

export default function ReviewCreationPage({ gameData }) {
  // Sets dark mode based on user's system preferences
  const [darkMode, setDarkMode] = React.useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sets dark mode based on user's system preferences
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
      <div className="review-content-container">
        <h1 style={{ color: 'var(--text-color)' }}>Choose Rating</h1> {/* Example header */}
        <StarSelection />
      </div>
    </div>
  );
}
