import React, { useState, useEffect, useRef } from "react";
import socket from "../socket.js";
import './Chat.css';
import EmojiPicker from 'emoji-picker-react';

function ChatWindow({ selectedUser, user }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || "/avatars/default.png");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMessages([]);

    const receiveHandler = (data) => {
      if (
        (data.sender === selectedUser && data.to === user.username) ||
        (data.sender === user.username && data.to === selectedUser)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", receiveHandler);

    socket.on("messages_seen", ({ from }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.to === from && msg.sender === user.username
            ? { ...msg, seen: true }
            : msg
        )
      );
    });

    return () => {
      socket.off("receive_message", receiveHandler);
      socket.off("messages_seen");
    };
  }, [selectedUser, user.username]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      text: message,
      sender: user.username,
      to: selectedUser,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seen: false,
    };

    socket.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
    setEmojiPickerVisible(false);
  };

  const handleTyping = () => {
    socket.emit("typing", { sender: user.username, to: selectedUser });

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(setTimeout(() => {
      socket.emit("stop_typing", { sender: user.username, to: selectedUser });
    }, 2000));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleChangeAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64 preview
        // In real app: upload file to server and update user.avatar URL
        setMenuVisible(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedUser) {
    return (
      <div className="w-3/4 h-screen flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-username">{selectedUser}</div>
        <div className="menu-container">
          <button className="menu-button" onClick={toggleMenu}>
            &#x22EE;
          </button>
          {menuVisible && (
            <div className="menu-dropdown">
              <div className="user-info">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <div className="user-email">{user.email || "No email"}</div>
              </div>
              <button
                className="change-avatar-button"
                onClick={handleChangeAvatarClick}
              >
                Change Avatar
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.sender === user.username ? "message-sent" : "message-received"
            }`}
          >
            <div className="message-content-time">
              <span className="message-text">{msg.text}</span>
              <span className="message-time">
                {msg.time}
                {msg.sender === user.username && msg.seen && " • Seen"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <button className="emoji-button" onClick={toggleEmojiPicker}>
          😀
        </button>

        {emojiPickerVisible && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          className="input-field"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
