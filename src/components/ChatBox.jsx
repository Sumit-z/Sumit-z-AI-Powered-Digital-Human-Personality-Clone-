import { useEffect, useRef, useState } from "react";
import "../styles/ChatBox.css";

const Chatbox = ({ chatHistory = [], user = "Unknown", personalityId }) => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(chatHistory);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage = { user: true, message };
    setHistory((prev) => [...prev, newUserMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, personalityId, isFirstMessage }),
      });

      const data = await response.json();
      if (!data.reply) throw new Error("No reply from server");

      const aiMessage = { user: false, message: data.reply };
      setHistory((prev) => [...prev, aiMessage]);
      setIsFirstMessage(false);
    } catch (err) {
      console.error("Message failed:", err);
      alert("❌ Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (timestamp = new Date()) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src="/avatar.png"
          alt="Person"
          className="person-image"
        />
        <div className="person-name">
          <h2>{user}</h2>
          <p>{formatTime()}</p>
        </div>
      </div>

      <div className="chat-box">
        {history.map((entry, index) => (
          <div
            key={index}
            className={`chat-message ${entry.user ? "user" : "ai"}`}
          >
            <div className="message-content">{entry.message}</div>
            <div className="timestamp">{formatTime()}</div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message ai">
            <div className="message-content typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <div className="timestamp">{formatTime()}</div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          className="chat-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="send-btn" onClick={sendMessage} disabled={isTyping}>
          {isTyping ? "Typing..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
