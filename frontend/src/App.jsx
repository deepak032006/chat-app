import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import Register from "./components/register.jsx";
import socket from "./socket.js";
import GoogleLogin from "./components/GoogleLogin.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();

  // On redirect from Google, get user from URL
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
      socket.emit("join", user.username); // Notify backend of the joined user
    }
  }, [user]);

  // Handle logout
  const handleLogout = () => {
    socket.emit("logout", user.username); // Optionally notify the backend for logout
    setUser(null); // Remove user from the state
    setSelectedUser(null); // Clear selected user
    // Optionally you can navigate to login page or home
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {!user ? (
        <div style={styles.centerContainer}>
          <div>
            <Register setUser={setUser} />
            <GoogleLogin /> {/* This button should show when no user is logged in */}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", height: "100vh" }}>
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
