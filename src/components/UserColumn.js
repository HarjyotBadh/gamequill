import React from "react";
import ProfileCard from "../components/ProfileCard";
import "../styles/ProfileCard.css";
const UserColumn = ({ users }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
      {users.map((user, index) => (
        <div key={user.id} className="w-full">
          <div
            className="w-full"
            onClick={() =>
              (window.location.href = `/profile?user_id=${user.userId}`)
            }
            style={{ cursor: "pointer" }}
          >
            <ProfileCard userId={user.userId} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default UserColumn;
