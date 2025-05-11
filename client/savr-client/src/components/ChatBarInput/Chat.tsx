import React, { useState } from "react";
import ChatInput from "./ChatBarInput";
import axios from "axios";
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string>("");
  const handleSend = (text: string) => {
    console.log("User input:", text);
    setMessages(text);
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/chat',
        data: {
            message: text
        }
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error('Error sending message:', error);
    });
    // Send to backend / OpenAI API
  };

  

  return (
    <div className="chat-wrapper">
      {/* Messages go here */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Chat;
