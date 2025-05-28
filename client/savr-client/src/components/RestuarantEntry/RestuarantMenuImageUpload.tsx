import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import RestuarantMenuUploadInput from "./RestuarantMenuUploadInput";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RestuarantMenuImageUpload: React.FC = () => {
  const location = useLocation();
  const restaurantCardData = location.state;
  const [isLoading, setIsLoading] = useState(false);

  const imageHandling = (input: File | string) => {
    if (typeof input === "string") {
      // Optionally handle URLs here
    } else {
      // Handle image file
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64DataUrl = e.target?.result;
        if (typeof base64DataUrl === "string") {
          setIsLoading(true);
          axios.post("http://127.0.0.1:5000/extract-menu-html", {
            restaurant_data: restaurantCardData,
            image_urls: [base64DataUrl]
          }).then((response) => {
            console.log(response.data);
          }).catch((error) => {
            console.error("Error extracting menu HTML:", error);
          }).finally(() => {
            setIsLoading(false);
          });
        }
      };
      reader.readAsDataURL(input);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at top, #161a2b, #0a0f1f)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "800px",
          height: "400px",
          backgroundColor: "#1a1d26",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Static guidance message */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Typography
              level="body-md"
              sx={{
                backgroundColor: "#2a2f3d",
                color: "#ddd",
                px: 2,
                py: 1,
                borderRadius: "12px",
              }}
            >
              Upload images of your menu or paste menu links below.
            </Typography>
          </Box>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress color="neutral" />
            </Box>
          )}
        </Box>

        {/* Input bar */}
        <Box sx={{ mt: 1 }}>
          <RestuarantMenuUploadInput
            onSend={imageHandling}
            placeholder="Upload images of the menu or send links of the menu"
            disabled={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RestuarantMenuImageUpload;
