import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import '../styles/CommentCreator.css'; // Import the new CSS file
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function CommentCreator({ review_id, currentUserUID }) {
    const [commentText, setCommentText] = useState("");
    const [commentHtml, setCommentHtml] = useState('');
    const maxLength = 1000; // Set a max length for a comment

    const handleChange = (content) => {
        setCommentHtml(content);
    };

    const getTextFromHtml = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const textLength = getTextFromHtml(commentHtml).length;

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const commentsRef = collection(
                db,
                "reviews",
                review_id,
                "comments"
            );
            await addDoc(commentsRef, {
                text: commentText,
                createdAt: new Date(),
                uid: currentUserUID,
            });
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    return (
        <div className="comment-text-field-container">
            <ReactQuill
                value={commentHtml}
                onChange={handleChange}
                placeholder="Write your comment..."
                modules={{ toolbar: [['bold', 'italic', 'underline', 'clean']] }} // Customize the toolbar options
                className="comment-text-field"
            />
            <div className={`comment-character-count ${textLength > maxLength ? 'error-text' : ''}`}>
                {textLength} / {maxLength}
            </div>
            {/* Add your submit button here */}
        </div>
    );
}
