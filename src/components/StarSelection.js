import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import '../styles/StarSelection.css';

const Star = ({ selectionType = 'empty', onClick = f => f }) => (
  <div className="star-container" onClick={onClick}>
    <StarIcon className={`star-icon ${selectionType === 'full' ? 'full-star' : 'empty-star'}`} />
    {selectionType === 'half' && (
      <div className="half-star-overlay">
        <StarIcon className="star-icon full-star" />
      </div>
    )}
  </div>
);

const createArray = length => [...Array(length)];

export default function StarSelection({ totalStars = 5 }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [darkMode, setDarkMode] = useState(
      () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
      const matcher = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e) => setDarkMode(e.matches);

      matcher.addListener(onChange);

      return () => {
          matcher.removeListener(onChange);
      };
  }, []);

  return (
    <div className={`flex-container ${darkMode ? "dark" : "light"}`} data-theme={darkMode ? "dark" : "light"}>
      <div className="star-rating">{selectedStars}</div>
      <div className="stars-row">
        {createArray(totalStars).map((n, i) => {
          let selectionType = 'empty';
          if (selectedStars > i) {
            selectionType = 'full';
          }
          if (selectedStars - i === 0.5) {
            selectionType = 'half';
          }
          return (
            <Star
              key={i}
              selectionType={selectionType}
              onClick={() => {
                const diff = selectedStars - i;
                if (diff > 0 && diff < 1) {
                  setSelectedStars(i + 1);
                } else if (selectedStars === i + 1) {
                  setSelectedStars(i + 0.5);
                } else {
                  setSelectedStars(i + 1);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
