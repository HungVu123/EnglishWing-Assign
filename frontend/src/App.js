import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", message: input };

    // Update the message state with the new message
    setMessage((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);

    // Clear the input field and set typing status
    setInput("");
    setIsTyping(true);

    try {
      // Send the new message to the API in the specified format
      const response = await axios.post(
        `https://english-wing-assign.vercel.app`,
        newMessage
      );
      console.log(response.data.response);
      // Add the bot's response to the messages after a delay
      setTimeout(() => {
        setMessage((prevMessages) => [
          ...prevMessages,
          { role: "bot", content: response.data.response },
        ]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <h1 style={styles.heading}>AI Chatbot: English Grammar Tutor</h1>
      <div style={styles.chatboxContainer}>
        <div style={styles.chatWindow}>
          {message.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.role === "user" ? "#DCF8C6" : "#fff",
              }}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && (
            <div style={styles.typingIndicator}>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
            </div>
          )}
        </div>
        <div style={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyUp={handleKeyPress}
            style={styles.input}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  heading: {
    fontSize: "3.2em",
    lineHeight: "1.1",
    textAlign: "center",
    position: "sticky",
    top: "0",
  },
  chatboxContainer: {
    width: "100%",
    maxWidth: "800px",
    height: "80vh",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    backgroundColor: "#fff",
  },
  chatWindow: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
  },
  message: {
    maxWidth: "70%",
    margin: "5px 0",
    padding: "10px",
    borderRadius: "10px",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "10px",
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "5px",
    resize: "none",
    minHeight: "50px",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  sendButton: {
    padding: "8px 15px",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px",
    fontSize: "14px",
    color: "#888",
  },
  dot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: "#000000",
    margin: "0 2px",
    animation: "typing 1s infinite",
  },
};

export default App;
