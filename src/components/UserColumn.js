import React from "react";
const UserColumn = ({ users }) => {
  return (
    <div className="usersColumn">
      {users.map((user, index) => (
        <div key={user.id} className="userContainer">
          <div className="username">{user.username}</div>
        </div>
      ))}
    </div>
  );
};
export default UserColumn;
