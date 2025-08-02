import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/joy/CircularProgress';
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
  Restaurant_info: {
    name: string;
    address: string;
    Opening_hours: string;
    logo: string;
  };
}

const Chat: React.FC = () => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSend = (text: string) => {
    setUserMessage(text);
    setIsLoading(true);

    axios.post('http://127.0.0.1:5000/chat', { message: text })
      .then(res => {
        const data: ResponseData = res.data;
        setResponseMessage(data.message);
        if (data.status === 'valid' && data.data) {
          
          console.log(data.Restaurant_info);
          console.log(data.data);
         navigate('/restaurant-display', { state: { restaurantData: data.Restaurant_info, reservationData: data.data } });
        }
      })
      .catch(() => {
        setResponseMessage('Error connecting to server. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at top, #161a2b, #0a0f1f)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '800px',
          height: '600px',
          backgroundColor: '#1a1d26',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Message area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
          {userMessage && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Typography
                level="body-md"
                sx={{
                  backgroundColor: '#2e3953',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                }}
              >
                {userMessage}
              </Typography>
            </Box>
          )}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress color="neutral" />
            </Box>
          )}

          {responseMessage && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Typography
                level="body-md"
                sx={{
                  backgroundColor: '#2a2f3d',
                  color: '#ddd',
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                }}
              >
                {responseMessage}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input bar */}
        <Box sx={{ mt: 1 }}>
          <ChatInput onSend={handleSend} />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
