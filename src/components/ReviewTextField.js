import React from 'react';
import '../styles/ReviewTextField.css';

export default function ReviewTextField({ reviewText, setReviewText }) {
  const maxLength = 5000;

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setReviewText(e.target.value);
    }
  };

  return (
    <div className="review-text-field-container">
        <textarea 
            className="review-text-field" 
            placeholder="Enter your review here..."
            value={reviewText}
            onChange={handleInputChange}
        />
        <div className="review-character-count">
            {reviewText.length} / {maxLength}
        </div>
    </div>
);
}
