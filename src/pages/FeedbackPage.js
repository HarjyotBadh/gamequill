import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { db, auth } from "../firebase"; // Ensure you have this import
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
  } from "firebase/firestore";
import "../styles/FeedbackPage.css";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');

  const handleInputChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    const feedbackData = { feedback };
    fetch('http://localhost:8080/http://localhost:3001/send-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
      setFeedback(''); // Clear textarea
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  

  return (
    <div class="feedback-background">
      <NavBar />
      <div class="feedback-container">
        <h4 class="feedback-info">Do you have feedback for the site? Submit it here:</h4>
        <textarea class="feedback-text-area" value={feedback} onChange={handleInputChange}/>
        <button class="feedback-button" onClick={handleSubmit}>Submit Feedback</button>
      </div>

      <Footer />
    </div>
  );
}
