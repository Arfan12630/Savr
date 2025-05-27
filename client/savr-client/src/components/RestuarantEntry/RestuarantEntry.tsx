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
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entryMessages, setEntryMessages] = useState<string>("Please enter the name of the restaurant");
  const [hovered, setHovered] = useState<boolean>(false);
  const navigate = useNavigate();

  const currentField = fields[currentStep];
 
  const handleSend = async (value: string) => {
    setIsLoading(true);
    const updatedInputs = { ...inputs, [currentField]: value };
    setInputs(updatedInputs);

    setUserMessage(value);
    setEntryMessages("");

    if (currentStep < fields.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
      setResponseMessage(`Please enter ${fields[currentStep + 1]} name`);
    } else {
      // Only send to backend when all fields are collected
      try {
        setResponseMessage("");
        const response = await axios.post('http://127.0.0.1:5000/get-address-options', updatedInputs);
        setResponseMessage(response.data.response || "Are these addresses correct?, If so which one are you located in?");
        setCards(response.data.cards);
      } catch (error) {
        setResponseMessage("Error connecting to server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardClick = async (card: any) => {
    console.log(card);
    try{
    const response = await axios.post('http://127.0.0.1:5000/get-address-info', card);
    console.log(response.data);
    if(response.data.message == "Restaurant already exists"){
      setResponseMessage("Restaurant already exists");
      setCards([]);
      setCurrentStep(0);
      setInputs({});
      setUserMessage("");
      setEntryMessages("");
      setHovered(false);
      setIsLoading(false);
      setResponseMessage("Please Upload images of the menu or send links of the menu");
      setHovered(true); 
    }
  } catch (error) {
    console.log(error);
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

          {entryMessages && (
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
                {entryMessages}       
              </Typography>
            </Box>
          )}

          {cards && cards.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              {cards.map((card, idx) => (
                <Box onClick={()=>{handleCardClick(card)}} key={card.name ? card.name + idx : idx} sx={{ mb: 1 }}>
                  <Typography level="body-md" sx={{ fontWeight: 'bold' }}>{card.name}</Typography>
                  <Typography level="body-sm">{card.address}</Typography>
                  <Typography level="body-xs">{card.hours}</Typography>
                  {card.logo && <img src={card.logo} alt={card.name} style={{ maxWidth: 50, maxHeight: 50 }} />}
                </Box>
              ))}
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