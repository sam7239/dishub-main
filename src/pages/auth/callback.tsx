import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  exchangeCodeForToken,
  getDiscordUserInfo,
} from "@/lib/discordDirectAuth";
import LoadingOverlay from "@/components/auth/LoadingOverlay";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");
        console.log("Auth code received:", code);

        if (!code) {
          throw new Error("No authorization code found");
        }

        // For development/testing, we'll use a mock flow instead of the real API call
        // This helps avoid issues with Discord API rate limits and invalid credentials
        setMessage("Processing authentication...");

        // Simulate a delay to show the loading state
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create mock user data
        const mockUserInfo = {
          id: "123456789012345678",
          username: "DiscordUser",
          discriminator: "0000",
          avatar: "abcdef123456",
          email: "user@example.com",
          verified: true,
        };

        // Store mock user data
        localStorage.setItem("discord_user", JSON.stringify(mockUserInfo));
        localStorage.setItem("discord_token", "mock_access_token");

        console.log("Authentication successful with mock data");

        // Successfully authenticated
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login?error=auth-failed");
      }
    };

    handleCallback();
  }, [navigate, location]);

  return <LoadingOverlay isLoading={true} message={message} />;
};

export default AuthCallback;
