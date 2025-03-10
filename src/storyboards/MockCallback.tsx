import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/auth/LoadingOverlay";

const MockCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Processing authentication...");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const simulateAuth = async () => {
      // Simulate the authentication process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Exchanging code for token...");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Getting user information...");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Authentication successful!");

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

      setIsLoading(false);
      setIsComplete(true);
    };

    simulateAuth();
  }, []);

  const handleContinue = () => {
    // In a real app, this would navigate to the dashboard
    alert("Redirecting to dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {isLoading ? (
        <LoadingOverlay isLoading={true} message={message} />
      ) : (
        <Card className="w-[400px] bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Authentication Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-green-600 font-medium">
              Successfully authenticated with Discord!
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                size="lg"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MockCallback;
