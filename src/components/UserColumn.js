import React from "react";
import ProfileCard from "../components/ProfileCard";
import "../styles/ProfileCard.css";
const UserColumn = ({ users }) => {
  return (
    <div className="usersColumn">
      {users.map((user, index) => (
        <div key={user.id} className="userContainer">
          <div
            className="username"
            onClick={() =>
              (window.location.href = `/profile?user_id=${user.userId}`)
            }
            style={{ cursor: "pointer" }}
          >
            {/* {user.username} */}
            <ProfileCard userId={user.userId} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default UserColumn;
