import { useState } from 'react';

import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RestuarantEntryInput } from './RestuarantEntryInput';

const fields = ['restaurant', 'city'];
type Field = (typeof fields)[number];

// TODO: Large component (234 lines) - needs refactoring
// - Extract API calls into custom hooks
// - Split into smaller components (RestaurantForm, RestaurantCard, etc.)
// - Move inline styles to CSS classes
// - Add proper error handling and loading states
// - Remove console.log statements
const RestuarantEntry = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [inputs, setInputs] = useState<{ [K in Field]?: string | File }>({});
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [cards, setCards] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entryMessages, setEntryMessages] = useState<string>(
    'Please enter the name of the restaurant'
  );
  const navigate = useNavigate();
  const [showLogoStep, setShowLogoStep] = useState(false);

  const handleSend = async (value: string | File) => {
    setIsLoading(true);

    if (showLogoStep && value instanceof File) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const base64DataUrl = e.target?.result;
        if (typeof base64DataUrl === 'string') {
          try {
            const response = await axios.post(
              'http://127.0.0.1:8000/upload-logo',
              { ...inputs, logo: base64DataUrl }
            );
            // TODO: Remove console.log - debugging statement
            console.log(response.data);
            setCards([response.data]);
            setResponseMessage('Logo uploaded successfully!');
          } catch (error) {
            setResponseMessage('Error uploading logo.');
          } finally {
            setIsLoading(false);
          }
        }
      };
      setEntryMessages('');
      reader.readAsDataURL(value);
      return;
    }

    const updatedInputs = { ...inputs, [fields[currentStep]]: value };
    setInputs(updatedInputs);
    setEntryMessages('');

    if (currentStep < fields.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
      setResponseMessage(`Please enter ${fields[currentStep + 1]} name`);
    } else {
      // Send restaurant and city to backend
      try {
        setResponseMessage('');
        const response = await axios.post(
          'http://127.0.0.1:8000/get-address-options',
          updatedInputs
        );
        // TODO: Remove console.log - debugging statement
        console.log(response.data);

        setShowLogoStep(true); // Now prompt for logo
        setEntryMessages('Please upload your restaurant logo');
      } catch (error) {
        setResponseMessage('Error connecting to server. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardClick = async (card: any) => {
    console.log(card);
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/get-address-info',
        card
      );
      console.log(response.data);
      if (response.data.message === 'Restaurant already exists') {
        setResponseMessage('Restaurant already exists');
      }
      setTimeout(() => {
        navigate('/owner/restaurant-entry/menu-image-upload', { state: card });
      }, 500);
    } catch (error) {
      console.log(error);
      setResponseMessage('Error connecting to server. Please try again.');
    } finally {
      setIsLoading(false);
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
      }}>
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
        }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
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
                }}>
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
                }}>
                {entryMessages}
              </Typography>
            </Box>
          )}

          {cards && cards.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 2,
              }}>
              {cards.map((card, idx) => (
                <Box
                  onClick={() => {
                    handleCardClick(card);
                  }}
                  key={card.name ? card.name + idx : idx}
                  sx={{ mb: 1 }}>
                  {card.logo && (
                    <img
                      src={card.logo}
                      alt={card.name}
                      style={{ maxWidth: 50, maxHeight: 50 }}
                    />
                  )}
                  <Typography
                    level="body-md"
                    sx={{ fontWeight: 'bold' }}>
                    {card.name}
                  </Typography>
                  <Typography level="body-sm">{card.address}</Typography>
                  <Typography level="body-sm">Opening Hours:</Typography>
                  {Array.isArray(card.opening_hours) ? (
                    card.opening_hours.map((entry: string, i: number) => (
                      <Typography
                        level="body-xs"
                        key={i}>
                        {entry}
                      </Typography>
                    ))
                  ) : (
                    <Typography level="body-xs">
                      {card.opening_hours}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Input bar */}
        <Box sx={{ mt: 1 }}>
          <RestuarantEntryInput
            onSend={handleSend}
            placeholder={
              showLogoStep
                ? 'Upload your logo...'
                : `Enter ${fields[currentStep]}...`
            }
            disabled={isLoading}
            showFileInput={showLogoStep}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { RestuarantEntry };
