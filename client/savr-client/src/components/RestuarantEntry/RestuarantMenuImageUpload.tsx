import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import RestuarantMenuUploadInput from "./RestuarantMenuUploadInput";

const RestuarantMenuImageUpload: React.FC = () => {
  const imageHandling = (input: File | string) => {
    if (typeof input === "string") {
      // Handle URL
      console.log("URL submitted:", input);
    } else {
      // Handle image file
      console.log("Image file submitted:", input);
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
        </Box>

        {/* Input bar */}
        <Box sx={{ mt: 1 }}>
          <RestuarantMenuUploadInput
            onSend={imageHandling}
            placeholder="Upload images of the menu or send links of the menu"
            disabled={false}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RestuarantMenuImageUpload;
