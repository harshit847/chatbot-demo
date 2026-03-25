import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/chat.css";

export default function Chatbot() {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef();

  const userId = useRef(
    localStorage.getItem("chat_user") ||
    ("user_" + Date.now())
  );

  useEffect(() => {
    localStorage.setItem("chat_user", userId.current);
  }, []);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

useEffect(() => {
  if (open && messages.length === 0) {
    setMessages([
      {
        sender: "bot",
        text: "Hi 👋 I'm AmplifyEase Assistant. How can I help you today?"
      }
    ]);
  }
}, [open]);



  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {

      const res = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
        userId: userId.current
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply
      };

      setMessages(prev => [...prev, botMsg]);

    } catch {

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server not responding." }
      ]);
    }

    setLoading(false);
  };


  return (
    <>
    <div className="navbar">
      💬Chatbot Demo
    </div>

      <div
        className="chat-icon"
        onClick={() => setOpen(!open)}
      >
        💬
      </div>


      {open && (

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="chat-box"
        >

          <header>
            AmplifyEase Assistant
            <span className="cancel" onClick={() => setOpen(false)}>✖</span>
          </header>


          <main>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`msg ${m.sender}`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="typing">
                Bot is typing...
              </div>
            )}

            <div ref={endRef}></div>

          </main>


          <footer>

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </footer>

        </motion.div>

      )}

<div className="watermark">
  Built by Harshit • 💬ChatBot Demo
</div>

    </>
  );
}
