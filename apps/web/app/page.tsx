"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";
export default function Page() {
  const { sendMessage,messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
     
      <div>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="message..."
          className={classes["chat-input"]}
        />
        <button
          className={classes["button"]}
          onClick={(e) => sendMessage(message)}
        >
          Send
        </button>
      </div>
      <div>
        <h1>All messages will appear here</h1>
        {messages.map(e=>(
          <li key={e}>{e}</li>
        ))}
      </div>

    </div>
  );
}
