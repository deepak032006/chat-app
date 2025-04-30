import React from "react";

function GoogleLogin() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
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
        marginTop: "1rem", // Ensure some margin is added to prevent overlap
      }}
    >
      🔒 Sign in with Google
    </button>
  );
}

export default GoogleLogin;
