import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/CommentCreator.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Button from '@mui/material/Button';

export default function CommentCreator({ review_id, currentUserUID, setHasCommented }) {
    const [commentHtml, setCommentHtml] = useState('');
    const maxLength = 1000;

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
                text: commentHtml,
                timestamp: new Date(),
                uid: currentUserUID,
            });
            setCommentHtml("");
            setHasCommented(true);
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
            <Button variant="contained" onClick={handleCommentSubmit} disabled={textLength > maxLength || textLength <= 0}> Post </Button>
        </div>
    );
}
