import React, { useState } from 'react';
import '../styles/ReviewTextField.css';

export default function ReviewTextField() {
  const [review, setReview] = useState("");
  const maxLength = 5000;

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setReview(e.target.value);
    }
  };

  return (
    <div className="review-text-field-container">
        <textarea 
            className="review-text-field" 
            placeholder="Enter your review here..."
            value={review}
            onChange={handleInputChange}
        />
        <div className="review-character-count">
            {review.length} / {maxLength}
        </div>
    </div>
);
}
