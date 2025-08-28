import React, { useState, useEffect } from "react";
import socket from "../socket.js";
import './UserCard.css';

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
    <div className="sidebar bg-gray-100 border-r border-gray-300 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 px-4 pt-4">Online Users</h2>
      {users.length > 0 ? (
        <div className="user-list flex overflow-x-auto pb-4 px-4 space-x-4">
          {users.map((u, idx) => (
            <div
              key={idx}
              onClick={() => onSelectUser(u.username)}
              className="user-card flex-none w-24 flex flex-col items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg transition"
            >
              <img
                src={`https://localhost:5000${u.avatar || '/avatars/default.png'}`}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover mb-1"
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="username font-medium text-sm text-gray-800 truncate w-20">
                    {u.username}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${u.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {typingUsers.includes(u.username)
                    ? "Typing..."
                    : u.isOnline
                    ? "Online"
                    : "Offline"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 px-4">No users online</div>
      )}
      <div className="mt-auto p-4">
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