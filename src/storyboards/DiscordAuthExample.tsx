import React from "react";
import { useDiscordAuth } from "@/hooks/useDiscordAuth";
import DiscordAuthButton from "@/components/auth/DiscordAuthButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const DiscordAuthExample = () => {
  const { userProfile, isAuthenticated, isLoading, error, login } =
    useDiscordAuth();

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
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error.message || "Authentication failed"}
            </div>
          )}

          {isAuthenticated && userProfile ? (
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.photoURL} />
                <AvatarFallback>
                  {userProfile.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium text-lg">
                  {userProfile.displayName}
                </h3>
                <p className="text-sm text-gray-500">{userProfile.email}</p>
                {userProfile.discordId && (
                  <p className="text-xs text-gray-400">
                    Discord ID: {userProfile.discordId}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <DiscordAuthButton
                onSuccess={(user) => console.log("Logged in:", user)}
                onError={(err) => console.error("Login error:", err)}
                size="lg"
              />
            </div>
          )}
        </CardContent>

        {isAuthenticated && (
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Sign Out
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DiscordAuthExample;
