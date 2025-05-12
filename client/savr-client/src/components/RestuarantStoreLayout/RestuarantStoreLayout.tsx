import React from "react";
import { useLocation, Link } from "react-router-dom";

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

const RestaurantStoreLayout: React.FC = () => {
  const location = useLocation();
  const restaurantData = location.state?.restaurantData as RestaurantData;

  if (!restaurantData) {
    return (
      <div className="no-data">
        <h3>No restaurant data found</h3>
        <Link to="/">Return to search</Link>
      </div>
    );
  }

  return (
    <div className="restaurant-display">
      <h2>Results for {restaurantData.restaurant} in {restaurantData.city}, {restaurantData.state}</h2>
      
      <div className="results-list">
        {restaurantData.results.map((restaurant, index) => (
          <div key={index} className="restaurant-card">
            {restaurant.logo && <img src={restaurant.logo} alt={restaurant.name} className="restaurant-logo" />}
            <h4>{restaurant.name}</h4>
            <p>{restaurant.address}</p>
            <p>Hours: {restaurant.hours || "Not available"}</p>
          </div>
        ))}
      </div>
      
      <Link to="/" className="back-btn">Back to Search</Link>
    </div>
  );
};

export default RestaurantStoreLayout;