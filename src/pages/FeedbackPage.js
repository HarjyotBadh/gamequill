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
    const user = auth.currentUser.uid; // Get current user ID
    const docRef = doc(db, "profileData", user); // Specify the collection and document
  
    try {
      await updateDoc(docRef, {
        feedback: arrayUnion(feedback), // Use the feedback state variable
      });
      console.log("Feedback submitted!");
      setFeedback(''); // Optionally clear the textarea after submission
    } catch (error) {
      console.error("Error adding feedback to Firestore:", error);
    }
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
