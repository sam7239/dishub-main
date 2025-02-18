import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import AuthStateIndicator from "./AuthStateIndicator";

type AuthState = "idle" | "loading" | "success" | "error";

interface DiscordLoginCardProps {
  onLogin?: () => void;
  authState?: AuthState;
  errorMessage?: string;
  className?: string;
}

const DiscordLoginCard = ({
  onLogin = () => {},
  authState = "idle",
  errorMessage = "Authentication failed. Please try again.",
  className = "",
}: DiscordLoginCardProps) => {
  const getMessage = () => {
    switch (authState) {
      case "loading":
        return "Authenticating with Discord...";
      case "success":
        return "Successfully authenticated!";
      case "error":
        return errorMessage;
      default:
        return "Please log in with Discord";
    }
  };

  return (
    <Card className={`w-[400px] bg-white shadow-lg ${className}`}>
      <CardHeader className="text-center">
        <h2 className="font-bold text-gray-900 text-3xl">Welcome</h2>
        <p className="text-gray-500">Sign in to continue</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <AuthStateIndicator state={authState} message={getMessage()} />

        <Button
          onClick={onLogin}
          disabled={authState === "loading"}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Login with Discord
        </Button>
      </CardContent>
    </Card>
  );
};

export default DiscordLoginCard;
