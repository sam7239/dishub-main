import React, { useState } from "react";
import DiscordLoginCard from "@/components/auth/DiscordLoginCard";
import { loginWithDiscord } from "@/lib/discordAuth";

const DiscordLoginExample = () => {
  const [authState, setAuthState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setAuthState("loading");
    setErrorMessage("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const { success, error } = await loginWithDiscord();
      if (!success) {
        setAuthState("error");
        setErrorMessage(error?.message || "Failed to connect to Discord");
      } else {
        setAuthState("success");
        // In a real app, redirect would happen automatically via auth state change
        setTimeout(() => {
          setAuthState("idle");
        }, 2000);
      }
    } catch (error) {
      setAuthState("error");
      setErrorMessage("An unexpected error occurred");
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

export default DiscordLoginExample;
