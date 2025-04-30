import React, { useState, useEffect } from "react";
import socket from "../socket.js";
import './Chat.css';
import EmojiPicker from 'emoji-picker-react';

function ChatWindow({ selectedUser, user }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null); // To manage typing timeout
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

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
    socket.on("receive_file", (fileData) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: fileData.sender,
          text: "File received: " + fileData.fileName,
          file: fileData.fileName,
          fileUrl: fileData.fileUrl,
          time: fileData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    });

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
      socket.off("receive_file");
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
      seen: false
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

    // Clear the existing timeout (if there's any)
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout for stopping typing after 2 seconds
    setTypingTimeout(setTimeout(() => {
      socket.emit("stop_typing", { sender: user.username, to: selectedUser });
    }, 2000)); // 2 seconds delay
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
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
      <div className="chat-header">Chat with {selectedUser}</div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === user.username ? "message-sent" : "message-received"}`}
          >
            <div className="message-sender">
              {msg.sender === user.username ? "You" : msg.sender}
            </div>
            <div>{msg.text}</div>
            <div className="text-xs text-gray-400 mt-1">
              {msg.time}
              {msg.sender === user.username && msg.seen && " • Seen"}
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
