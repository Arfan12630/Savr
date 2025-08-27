import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import ChatInput from "./ChatBarInput";
import axios from "axios";

interface ResponseData {
  status: "valid" | "invalid" | "error";
  message: string;
  data?: {
    restaurant: string;
    city: string;
    state: string;
    country: string;
    results: any[];
  };
  Restaurant_info: {
    name: string;
    address: string;
    Opening_hours: string;
    logo: string;
  };
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    axios
      .post("http://127.0.0.1:8000/chat", { message: text })
      .then((res) => {
        const data: ResponseData = res.data;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message || "" },
        ]);
        if (data.status === "valid" && data.data) {
          navigate("/restaurant-display", {
            state: {
              restaurantData: data.Restaurant_info,
              reservationData: data.data,
            },
          });
        }
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Error connecting to server. Please try again.",
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(1200px 800px at 50% -200px, #20263d 10%, #0a0f1f 60%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          height: "85vh",
          maxHeight: 820,
          background:
            "linear-gradient(180deg, rgba(26,29,38,0.95), rgba(17,20,30,0.95))",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "28px",
          boxShadow:
            "0 10px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            background:
              "linear-gradient(180deg, rgba(32,38,61,0.6), rgba(26,29,38,0.2))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "rgba(99,102,241,0.18)",
              color: "#a5b4fc",
              fontSize: 16,
            }}
          >
            🤖
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Typography level="title-sm" sx={{ color: "#e5e7eb" }}>
              Chat with Savr Bot
            </Typography>
            <Typography level="body-xs" sx={{ color: "#9aa3b2" }}>
              Helpful assistant
            </Typography>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            background:
              "linear-gradient(180deg, rgba(16,20,33,0.35), transparent 120px)",
          }}
        >
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {!isUser && (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(148,163,184,0.18)",
                      color: "#cbd5e1",
                      fontSize: 14,
                      mt: "auto",
                    }}
                  >
                    🤖
                  </Box>
                )}
                <Box
                  sx={{
                    maxWidth: "82%",
                    px: 12 / 8,
                    py: 10 / 8,
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    color: isUser ? "#fff" : "#d6d9e2",
                    background: isUser
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "linear-gradient(180deg, rgba(34,40,58,0.9), rgba(28,33,50,0.9))",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isUser
                      ? "0 6px 18px rgba(99,102,241,0.35)"
                      : "0 6px 16px rgba(2,6,23,0.45)",
                    wordBreak: "break-word",
                    lineHeight: 1.45,
                    fontSize: 14,
                  }}
                >
                  {m.content}
                </Box>
                {isUser && (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(99,102,241,0.18)",
                      color: "#a5b4fc",
                      fontSize: 14,
                      mt: "auto",
                    }}
                  >
                    🧑
                  </Box>
                )}
              </Box>
            );
          })}

          {isLoading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(148,163,184,0.18)",
                  color: "#cbd5e1",
                  fontSize: 14,
                }}
              >
                🤖
              </Box>
              <Box
                sx={{
                  px: 12 / 8,
                  py: 10 / 8,
                  borderRadius: "16px 16px 16px 4px",
                  background:
                    "linear-gradient(180deg, rgba(34,40,58,0.9), rgba(28,33,50,0.9))",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <CircularProgress size="sm" color="neutral" />
              </Box>
            </Box>
          )}
        </Box>

        {/* Input */}
        <Box sx={{ p: 14 / 8, background: "rgba(13,17,27,0.6)" }}>
          <ChatInput onSend={handleSend} />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
