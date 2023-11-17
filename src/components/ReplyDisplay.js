// ReplyDisplay.js
import React, { useState, useEffect } from "react";
import { fetchRepliesByCommentId } from "../functions/ReviewFunctions";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import "../styles/CommentDisplay.css";
import { TrashIcon } from "@heroicons/react/24/outline";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ReplyDisplay({
    review_id,
    comment_id,
    hasReplied,
    setHasReplied,
    currentUserUID,
}) {
    const [replies, setReplies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const repliesData = await fetchRepliesByCommentId(
                    review_id,
                    comment_id
                );
                setReplies(repliesData);
            } catch (error) {
                console.error("Error fetching replies: ", error);
                // Handle the error appropriately
            }
        };

        fetchData();
    }, [review_id, comment_id, hasReplied]);

    const openDeleteDialog = (replyId) => {
        setReplyToDelete(replyId);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const confirmDeleteReply = async () => {
        if (replyToDelete) {
            try {
                await deleteDoc(
                    doc(
                        db,
                        "reviews",
                        review_id,
                        "comments",
                        comment_id,
                        "replies",
                        replyToDelete
                    )
                );
                setReplies(
                    replies.filter((reply) => reply.id !== replyToDelete)
                );
                setHasReplied(false);
                setOpenDialog(false);
            } catch (error) {
                console.error("Error deleting reply: ", error);
                // Handle the error appropriately
            }
        }
    };

    return (
        <div className="reply-display">
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Reply"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this reply?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={confirmDeleteReply} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {replies.map((reply) => (
                <div key={reply.id} className="comment-box">
                    <div className="comment-header">
                        <Link
                            to={`/Profile?user_id=${reply.uid}`}
                            className="user-info-container"
                        >
                            <Avatar
                                className="custom-avatarr medium-avatarr"
                                src={reply.profilePicture}
                            />
                            <div className="user-info">
                                <span className="comment-username">
                                    {reply.username}
                                </span>
                                <span className="comment-time">
                                    {new Date(
                                        reply.timestamp?.seconds * 1000
                                    ).toLocaleString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </Link>
                        {reply.uid === currentUserUID && (
                            <TrashIcon
                                className="delete-reply-icon"
                                onClick={() => openDeleteDialog(reply.id)}
                            />
                        )}
                        {/* Implement like functionality for replies if needed */}
                    </div>
                    <p
                        className="comment-text"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(reply.text),
                        }}
                    >
                        {/* Reply content will be inserted here */}
                    </p>
                </div>
            ))}
        </div>
    );
}
