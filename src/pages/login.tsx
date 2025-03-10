import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DiscordLoginCard from "@/components/auth/DiscordLoginCard";
import { loginWithDiscordDirect } from "@/lib/discordDirectAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("error") === "auth-failed") {
      setAuthState("error");
      setErrorMessage("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  const handleLogin = () => {
    setAuthState("loading");
    setErrorMessage("");

    try {
      // Direct Discord OAuth flow - redirects to Discord
      loginWithDiscordDirect();
      // No need to set success state as we're redirecting away
    } catch (error) {
      setAuthState("error");
      setErrorMessage("Failed to connect to Discord");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DiscordLoginCard
        onLogin={handleLogin}
        authState={authState}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default LoginPage;
