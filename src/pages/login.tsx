import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DiscordLoginCard from "@/components/auth/DiscordLoginCard";
import { signInWithDiscord } from "@/lib/auth";

const LoginPage = () => {
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

  const handleLogin = async () => {
    setAuthState("loading");
    setErrorMessage("");

    const { error: authError } = await signInWithDiscord();
    if (authError) {
      setAuthState("error");
      setErrorMessage(authError.message || "Failed to connect to Discord");
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
