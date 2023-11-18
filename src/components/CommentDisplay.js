import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import "../styles/CommentDisplay.css";
import {
    fetchCommentsByReviewId,
    parseReviewWithSpoilersToHTML,
} from "../functions/ReviewFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import DOMPurify from "dompurify";
import {
    HandThumbUpIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import ReplyCreator from "./ReplyCreator";
import ReplyDisplay from "./ReplyDisplay";
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";

export default function CommentDisplay({
    review_id,
    hasCommented,
    setHasCommented,
    currentUserUid,
}) {
    const [comments, setComments] = useState([]);
    const [hasReplied, setHasReplied] = useState(false);
    const [userReplies, setUserReplies] = useState({});
    const [openDeleteCommentDialog, setOpenDeleteCommentDialog] =
        useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [shownReplies, setShownReplies] = useState({});
    const [filter, setFilter] = useState("mostRecent");

    useEffect(() => {
        const fetchData = async () => {
            try {
                let commentsData = await fetchCommentsByReviewId(review_id);

                // Sort comments based on filter
                switch (filter) {
                    case "mostRecent":
                        commentsData.sort(
                            (a, b) =>
                                b.timestamp?.seconds - a.timestamp?.seconds
                        );
                        break;
                    case "oldest":
                        commentsData.sort(
                            (a, b) =>
                                a.timestamp?.seconds - b.timestamp?.seconds
                        );
                        break;
                    case "mostLiked":
                        commentsData.sort(
                            (a, b) =>
                                (b.userLikes?.length || 0) -
                                (a.userLikes?.length || 0)
                        );
                        break;
                    case "leastLiked":
                        commentsData.sort(
                            (a, b) =>
                                (a.userLikes?.length || 0) -
                                (b.userLikes?.length || 0)
                        );
                        break;
                    default:
                        break;
                }

                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments: ", error);
            }
        };

        fetchData();
    }, [review_id, hasCommented, hasReplied, filter]);

    useEffect(() => {
        const checkUserReplies = async () => {
            const newUserReplies = {};
            for (const comment of comments) {
                const repliesRef = collection(
                    db,
                    "reviews",
                    review_id,
                    "comments",
                    comment.id,
                    "replies"
                );
                const queryConstraint = where("uid", "==", currentUserUid);
                const querySnapshot = await getDocs(
                    query(repliesRef, queryConstraint)
                );
                newUserReplies[comment.id] = !querySnapshot.empty;
            }
            setUserReplies(newUserReplies);
        };

        checkUserReplies();
    }, [comments, review_id, currentUserUid]);

    async function handleCommentLike(comment, currentUserUid) {
        // Initialize userLikes as an empty array if it doesn't exist
        const userLikes = comment.userLikes || [];

        // Check if the comment has been liked by the current user
        const isLiked = userLikes.includes(currentUserUid);

        // Add or remove the user's ID based on the current like status
        let updatedUserLikes = isLiked
            ? userLikes.filter((uid) => uid !== currentUserUid)
            : [...userLikes, currentUserUid];

        // Update the comment in the database
        const commentRef = doc(
            db,
            "reviews",
            review_id,
            "comments",
            comment.id
        );
        await updateDoc(commentRef, { userLikes: updatedUserLikes });

        // Update the local state to reflect the change
        setComments(
            comments.map((c) => {
                if (c.id === comment.id) {
                    return { ...c, userLikes: updatedUserLikes };
                }
                return c;
            })
        );

        // TODO : Add a notification to the user who was liked
    }

    const openDialog = (commentId) => {
        setCommentToDelete(commentId);
        setOpenDeleteCommentDialog(true);
    };

    const closeDialog = () => {
        setOpenDeleteCommentDialog(false);
    };

    const confirmDeleteComment = async () => {
        if (commentToDelete) {
            try {
                await deleteDoc(
                    doc(db, "reviews", review_id, "comments", commentToDelete)
                );
                setComments(
                    comments.filter((comment) => comment.id !== commentToDelete)
                );
                setHasCommented(false);
                closeDialog();
            } catch (error) {
                console.error("Error deleting comment: ", error);
            }
        }
    };

    const toggleReplies = (commentId) => {
        setShownReplies((prevShownReplies) => ({
            ...prevShownReplies,
            [commentId]: !prevShownReplies[commentId],
        }));
    };

    return (
        <div className="comment-display">
            <Dialog
                open={openDeleteCommentDialog}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Comment"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this comment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button onClick={confirmDeleteComment} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {comments.length > 0 && (
                <FormControl
                    variant="outlined"
                    className="mb-4 w-full max-w-xs"
                >
                    <InputLabel
                        id="demo-simple-select-outlined-label"
                        className="comment-filter-label"
                    >
                        Filter
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        label="Filter"
                        className="comment-filter-select"
                        MenuProps={{
                            classes: { paper: "comment-filter-menu" },
                        }}
                    >
                        <MenuItem
                            value="mostRecent"
                            className="comment-filter-menuitem"
                        >
                            Most Recent
                        </MenuItem>
                        <MenuItem
                            value="oldest"
                            className="comment-filter-menuitem"
                        >
                            Oldest
                        </MenuItem>
                        <MenuItem
                            value="mostLiked"
                            className="comment-filter-menuitem"
                        >
                            Most Liked
                        </MenuItem>
                        <MenuItem
                            value="leastLiked"
                            className="comment-filter-menuitem"
                        >
                            Least Liked
                        </MenuItem>
                    </Select>
                </FormControl>
            )}

            {comments.map((comment) => (
                <div key={comment.id} className="comment-and-reply-container">
                    <div className="comment-box">
                        <div className="comment-header">
                            {/* Toggle icon */}
                            {shownReplies[comment.id] ? (
                                <Tooltip title="Hide Replies">
                                <ChevronUpIcon
                                    className="toggle-replies-icon"
                                    onClick={() => toggleReplies(comment.id)}
                                />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Show Replies">
                                <ChevronDownIcon
                                    className="toggle-replies-icon"
                                    onClick={() => toggleReplies(comment.id)}
                                />
                                </Tooltip>
                            )}
                            <Link
                                to={`/Profile?user_id=${comment.uid}`}
                                className="user-info-container"
                            >
                                <Avatar
                                    className="custom-avatarr medium-avatarr"
                                    src={comment.profilePicture}
                                />
                                <div className="user-info">
                                    <span className="comment-username">
                                        {comment.username}
                                    </span>
                                    <span className="comment-time">
                                        {new Date(
                                            comment.timestamp?.seconds * 1000
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

                            <div className="like-button-container">
                                <HandThumbUpIcon
                                    className={
                                        comment.userLikes?.includes(
                                            currentUserUid
                                        )
                                            ? "liked"
                                            : "not-liked"
                                    }
                                    onClick={() =>
                                        handleCommentLike(
                                            comment,
                                            currentUserUid
                                        )
                                    }
                                />
                                <span className="like-count">{`${
                                    comment.userLikes?.length || 0
                                } likes`}</span>

                                {comment.uid === currentUserUid && (
                                    <TrashIcon
                                        className="delete-comment-icon"
                                        onClick={() => openDialog(comment.id)}
                                    />
                                )}
                            </div>
                        </div>
                        <p
                            className="comment-text"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    parseReviewWithSpoilersToHTML(comment.text)
                                ),
                            }}
                        >
                            {/* Content will be inserted by dangerouslySetInnerHTML */}
                        </p>
                    </div>
                    {shownReplies[comment.id] && (
                        <div className="reply-box">
                            {!userReplies[comment.id] && (
                                <ReplyCreator
                                    review_id={review_id}
                                    comment_id={comment.id}
                                    setHasReplied={setHasReplied}
                                    currentUserUID={currentUserUid}
                                />
                            )}

                            <ReplyDisplay
                                review_id={review_id}
                                comment_id={comment.id}
                                hasReplied={hasReplied}
                                setHasReplied={setHasReplied}
                                currentUserUID={currentUserUid}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
