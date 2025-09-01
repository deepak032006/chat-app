import React from "react";

function GoogleLogin() {
  const handleLogin = () => {
    window.location.href = 'https://chat-app-23-2tzv.onrender.com/api/auth/google';
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px 20px",
        fontSize: "14px",
        cursor: "pointer",
        width: "100%",
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
      }}
    >
      <img
        src="https://crystalpng.com/wp-content/uploads/2025/05/google-logo.png"
        alt="Google icon"
        style={{ width: "18px", height: "18px" }}
      />
      Sign in with Google
    </button>
  );
}

export default GoogleLogin;
