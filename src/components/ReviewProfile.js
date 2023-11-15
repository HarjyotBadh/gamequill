import React from "react";
import { Avatar } from "@material-tailwind/react";
import "../styles/ReviewProfile.css";

export default function ReviewProfile({ username, timestamp, profilePicture }) {
    return (
        <div className="review-profile">
            <Avatar src={profilePicture} className="avatar" />
            <div className="user-details">
                <h1 className="username">{username}</h1>
                <p className="timestamp">
                    {new Date(timestamp.seconds * 1000).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
}
