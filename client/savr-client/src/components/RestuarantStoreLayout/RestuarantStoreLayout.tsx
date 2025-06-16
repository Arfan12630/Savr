import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/joy";
import { styled, keyframes } from "@mui/system";
import Bookmark from '@mui/icons-material/BookmarkBorder';
import axios from "axios";

interface RestaurantData {
  restaurant: string;
  city: string;
  state: string;
  country: string;
  results: Array<{
    name: string;
    address: string;
    hours: string;
    logo: string;
    link: string;
    menu_images: string[];
  }>;
}

// Fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled card with dark mode and hover effects
const StyledCard = styled(Card)`
  animation: ${fadeIn} 0.5s ease-out;
  width: 280px;
  margin: 16px;
  background-color: #1e2431;
  border: 1px solid #2e3448;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    border-color: #1976d2;
  }
`;

const RestaurantStoreLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurantData = location.state?.restaurantData as RestaurantData;

  if (!restaurantData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#ccc' }}>
        <Typography level="h4">No restaurant data found</Typography>
        <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
          Back to Search
        </Link>
      </Box>
    );
  }

  const clickedImage = (restaurant: any) => {
    console.log(restaurant)
    navigate('/view', { state: { restaurantInfo: restaurant } });
 
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #151824, #0a0f1f)',
        p: 4,
      }}
    >
      <Typography level="h2" sx={{ color: 'white', textAlign: 'center', mb: 4 }}>
        Results for {restaurantData.restaurant} in {restaurantData.city}, {restaurantData.state}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {restaurantData.results.map((r, i) => (
          <StyledCard key={i} variant="outlined">
            <Box sx={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}
            onClick={() => clickedImage(r)}>
              {r.logo && (
                <img
                  src={r.logo}
                  alt={r.name}
                  onClick={() => clickedImage(r)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                />
              )}
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{ position: 'absolute', top: 8, right: 8, color: '#bbb' }}
              >
                <Bookmark />
              </IconButton>
            </Box>
            <CardContent sx={{ p: 2, flexGrow: 1 }}
            onClick={() => clickedImage(r)}>
              <Typography level="title-lg" sx={{ color: 'white', mb: 1 }}>
                {r.name}
              </Typography>
              <Typography level="body-sm" sx={{ color: '#aaa', mb: 1 }}>
                {r.address}
              </Typography>
              <Typography level="body-xs" sx={{ color: '#888' }}>
                Hours: {r.hours || 'Not available'}
              </Typography>
            </CardContent>
          </StyledCard>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
          &larr; New Search
        </Link>
      </Box>
    </Box>
  );
};

export default RestaurantStoreLayout;
