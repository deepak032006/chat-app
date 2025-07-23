import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import Register from "./components/Register.jsx";
import socket from "./socket.js";
import GoogleLogin from "./components/GoogleLogin.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    if (userParam) {
      try {
        const parsedUser = JSON.parse(userParam);
        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid user data from Google");
      }
    }
  }, [location]);

  useEffect(() => {
    if (user?.username) {
      socket.emit("join", user.username);
    }
  }, [user]);

  const handleLogout = () => {
    socket.emit("logout", user.username);
    setUser(null);
    setSelectedUser(null);
  };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      {!user ? (
        <div style={styles.centerContainer}>
          <div>
            <Register setUser={setUser} />
            <GoogleLogin />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          <Sidebar onSelectUser={setSelectedUser} user={user} onLogout={handleLogout} />
          <ChatWindow selectedUser={selectedUser} user={user} />
        </div>
      )}
    </div>
  );
}

const styles = {
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: "#f1f2f6",
  },
};

export default App;