import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/joy/CircularProgress';
import axios from "axios";
import RestuarantEntryInput from './RestuarantEntryInput';

const fields = ["restaurant", "city"];
type Field = typeof fields[number];

const RestuarantEntry: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userMessage, setUserMessage] = useState<string>("");
  const [inputs, setInputs] = useState<{ [K in Field]?: string }>({});
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const currentField = fields[currentStep];

  const handleSend = async (value: string) => {
    setIsLoading(true);
    const updatedInputs = { ...inputs, [currentField]: value };
    setInputs(updatedInputs);

    if (currentStep < fields.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    } else {
      // Only send to backend when all fields are collected
      try {
        const response = await axios.post('http://127.0.0.1:5000/get-address-options', updatedInputs);
        setResponseMessage(response.data.response);
      } catch (error) {
        setResponseMessage("Error connecting to server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
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
          height: '400px',
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
          <RestuarantEntryInput
            onSend={handleSend}
            placeholder={`Enter ${currentField}...`}
            disabled={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RestuarantEntry;