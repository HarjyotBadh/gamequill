import React, { useState, useEffect } from 'react';
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

    const countdownDisplay = timeLeft => {
        const formatNumber = number => number.toString().padStart(2, '0'); // Format numbers to have at least two digits
    
        return (
            <div class="countdown-text">
                {formatNumber(timeLeft.days)}:
                {formatNumber(timeLeft.hours)}:
                {formatNumber(timeLeft.minutes)}:
                {formatNumber(timeLeft.seconds)}
            </div>
        );
    };

    return (
        <div>
            {Object.keys(timeLeft).length ? countdownDisplay(timeLeft) : <span>Time's up!</span>}
        </div>
    );
};

export default UpcomingCountdown;
