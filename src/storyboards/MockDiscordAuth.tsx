import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MockDiscordAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock user data
    const mockUser = {
      uid: "mock-user-id",
      displayName: "Discord User",
      email: "discord-user@example.com",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=discord",
      discordId: "123456789012345678",
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-[400px] bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Discord Authentication
          </CardTitle>
          <CardDescription className="text-center">
            {isAuthenticated
              ? "You are logged in with Discord"
              : "Sign in with your Discord account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isAuthenticated && user ? (
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium text-lg">{user.displayName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                {user.discordId && (
                  <p className="text-xs text-gray-400">
                    Discord ID: {user.discordId}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 127.14 96.36"
                      fill="currentColor"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                    Login with Discord
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        {isAuthenticated && (
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Sign Out
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default MockDiscordAuth;
