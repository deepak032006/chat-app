import React, { useState, useEffect } from "react";
import socket from "../socket.js";
import './UserCard.css'; // Import the CSS file

function Sidebar({ onSelectUser, user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.emit("get_users");

    const handleUsersList = (userList) => {
      setUsers(userList.filter((u) => u.username !== user.username));
    };

    const handleTyping = (data) => {
      setTypingUsers((prev) =>
        !prev.includes(data.sender) ? [...prev, data.sender] : prev
      );
    };

    const handleStopTyping = (data) => {
      setTypingUsers((prev) =>
        prev.filter((username) => username !== data.sender)
      );
    };

    socket.on("users_list", handleUsersList);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("users_list", handleUsersList);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [user.username]);

  return (
    <div className="sidebar p-4 bg-gray-100 h-full w-64 overflow-y-auto border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">Online Users</h2>
      {users.length > 0 ? (
        users.map((u, idx) => (
          <div
            key={idx}
            onClick={() => onSelectUser(u.username)}
            className="user-card"
          >
            <div className="user-info">
              <div
                className={`status-indicator ${u.isOnline ? "status-online" : "status-offline"}`}
              ></div>
              <span className="username">{u.username}</span>
            </div>
            <div className="user-status-text">
              {u.isOnline ? "Online" : "Offline"}
              {typingUsers.includes(u.username) && (
                <span className="typing-indicator"> - Typing...</span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No users online</div>
      )}

      {/* Logout Button */}
      <div className="absolute bottom-4 left-0 right-0 p-4">
        <button
          onClick={onLogout}
          className="w-full py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
