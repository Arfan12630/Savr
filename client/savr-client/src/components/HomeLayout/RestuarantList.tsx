import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Restaurant = {
  name: string;
  address: string;
  logo: string;
  menu_images: string[];
  // add other fields as needed
};

const RestuarantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/restaurants"
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);
  return (
    <div>
    {restaurants.map((r, idx) => (
      <div key={idx}>
        <h2>{r.name}</h2>
        <p>{r.address}</p>
        <img src={r.logo} alt={r.name + " logo"} width={100} />
        <div>
          {r.menu_images.map((img, i) => (
            <img key={i} src={img} alt={`Menu ${i+1}`} width={100} />
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};

export default RestuarantList;
