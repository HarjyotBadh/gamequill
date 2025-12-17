import React, { useState, useEffect } from "react";
import "../styles/UpcomingCountdown.css";

const UpcomingCountdown = ({ time }) => {
  const calculateTimeLeft = () => {
    const difference = time * 1000 - new Date().getTime(); // Convert Unix timestamp to milliseconds
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const countdownDisplay = (timeLeft) => {
    return (
      <div
        className="countdown-text text-center font-bold"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
      >
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </div>
    );
  };

  return (
    <div>
      {Object.keys(timeLeft).length ? (
        countdownDisplay(timeLeft)
      ) : (
        <div class="countdown-text-over">
          this text shouldn't be here because the timestamp is in the past
        </div>
      )}
    </div>
  );
};

export default UpcomingCountdown;
