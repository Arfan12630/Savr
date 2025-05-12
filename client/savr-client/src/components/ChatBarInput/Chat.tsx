import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "./ChatBarInput";
import axios from "axios";

interface ResponseData {
  status: "valid" | "invalid" | "error";
  message: string;
  data?: {
    restaurant: string;
    city: string;
    state: string;
    country: string;
    results: any[];
  };
}

const Chat: React.FC = () => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSend = (text: string) => {
    console.log("User input:", text);
    setUserMessage(text);
    setIsLoading(true);
    
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/chat',
        data: {
            message: text
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        console.log(response.data);
        const responseData: ResponseData = response.data;
        
        setResponseMessage(responseData.message);
        
        if (responseData.status === "valid" && responseData.data) {
          // Navigate to the restaurant display component with the data
          navigate('/restaurant-display', { 
            state: { restaurantData: responseData.data } 
          });
        }
    })
    .catch((error) => {
        console.error('Error sending message:', error);
        setResponseMessage("Error connecting to server. Please try again.");
    })
    .finally(() => {
        setIsLoading(false);
    }); 
  };

  return (
    <div className="chat-wrapper">
      {/* User message */}
      {userMessage && (
        <div className="user-message">
          <p>{userMessage}</p>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && <div className="loading">Processing...</div>}
      
      {/* Response message */}
      {responseMessage && (
        <div className="response-message">
          <p>{responseMessage}</p>
        </div>
      )}
      
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Chat;
