import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RestuarantMenuUploadInput } from './RestuarantMenuUploadInput';

// TODO: Large component (197 lines) - needs refactoring
// - Extract file processing logic into custom hooks
// - Split into smaller components (FileUpload, MenuPreview, etc.)
// - Move inline styles to CSS classes
// - Add proper error handling
// - Remove console statements
const RestuarantMenuImageUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurantCardData = location.state;
  console.log(restaurantCardData);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedMenus, setExtractedMenus] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const imageHandling = (input: File[] | File | string) => {
    if (typeof input === 'string') {
      // Handle URLs here if needed
    } else if (Array.isArray(input)) {
      // Handle multiple files
      input.forEach(file => {
        processFile(file);
      });
    } else {
      // Handle single file
      processFile(input);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64DataUrl = e.target?.result;
      if (typeof base64DataUrl === 'string') {
        setIsLoading(true);
        axios
          .post('http://127.0.0.1:8000/extract-menu-html', {
            restaurant_data: restaurantCardData,
            image_urls: [base64DataUrl],
          })
          .then(response => {
            console.log(response.data);
            if (response.data.menu_html) {
              setExtractedMenus(prev => [...prev, response.data.menu_html]);
            }
            setShowConfirmation(true);
          })
          .catch(error => {
            console.error('Error extracting menu HTML:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadMore = () => {
    setShowConfirmation(false);
  };

  const handleFinishUploading = () => {
    // Save all extracted menus to database
    axios
      .post('http://127.0.0.1:8000/save-all-menu-html', {
        restaurant_data: restaurantCardData,
        menu_htmls: extractedMenus,
      })
      .then(response => {
        console.log('All menus saved:', response.data);
        navigate('/edit', {
          state: {
            restaurantCardData: restaurantCardData,
            extractedMenus: extractedMenus,
          },
        });
        // Navigate to next step or show success message
      })
      .catch(error => {
        console.error('Error saving menus:', error);
      });
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
        {/* Messages area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
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
              Upload images of your menu or paste menu links below.
            </Typography>
          </Box>

          {extractedMenus.length > 0 && (
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
                {extractedMenus.length} menu image(s) processed successfully.
              </Typography>
            </Box>
          )}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress color="neutral" />
            </Box>
          )}

          {showConfirmation && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#2a2f3d',
                  color: '#ddd',
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                }}>
                <Typography
                  level="body-md"
                  sx={{ mb: 2 }}>
                  Menu extracted successfully! Do you have more menu images to
                  upload?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="sm"
                    onClick={handleUploadMore}>
                    Yes, upload more
                  </Button>
                  <Button
                    size="sm"
                    variant="solid"
                    onClick={handleFinishUploading}>
                    No, I'm done
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Input bar */}
        <Box sx={{ mt: 1 }}>
          <RestuarantMenuUploadInput
            onSend={imageHandling}
            placeholder="Upload images of the menu or send links of the menu"
            disabled={isLoading || showConfirmation}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { RestuarantMenuImageUpload };
