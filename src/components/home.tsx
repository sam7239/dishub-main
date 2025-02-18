import React, { useState } from "react";
import LoginCard from "./auth/LoginCard";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    // Simulated delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
      // For demonstration purposes, randomly show an error
      if (Math.random() > 0.5) {
        setError("Failed to connect to Discord. Please try again.");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <LoginCard onLogin={handleLogin} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Home;
