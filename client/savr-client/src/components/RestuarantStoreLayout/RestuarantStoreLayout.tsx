import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/joy";
import { styled, keyframes } from "@mui/system";
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

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled card with animation
const StyledCard = styled(Card)`
  animation: ${fadeIn} 0.6s ease forwards;
  margin: 1rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: #1976d2; /* Optional: changes border color on hover */
  }
`;

const RestaurantStoreLayout: React.FC = () => {
  const location = useLocation();
  const restaurantData = location.state?.restaurantData as RestaurantData;

  if (!restaurantData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>No restaurant data found</h3>
        <Link to="/">Return to search</Link>
      </div>
    );
  }

  const clickedImage = (restaurant: any) => {
    console.log("clicked image");
    console.log(restaurant);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography level="h2" textAlign="center" mb={3}>
        Results for {restaurantData.restaurant} in {restaurantData.city}, {restaurantData.state}
      </Typography>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {restaurantData.results.map((restaurant, index) => (
          <StyledCard key={index} variant="outlined">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                onClick={() => clickedImage(restaurant)}
                style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
              />
            )}
            <CardContent>
              <Typography level="title-lg" fontWeight="lg">
                {restaurant.name}
              </Typography>
              <Typography>{restaurant.address}</Typography>
              <Typography level="body-sm">
                Hours: {restaurant.hours || "Not available"}
              </Typography>
            </CardContent>
          </StyledCard>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/" style={{ textDecoration: "underline", color: "#1976d2" }}>
          Back to Search
        </Link>
      </div>
    </div>
  );
};

export default RestaurantStoreLayout;
