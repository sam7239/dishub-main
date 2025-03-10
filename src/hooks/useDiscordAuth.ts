import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginWithDiscord, getUserProfile } from "@/lib/discordAuth";

export const useDiscordAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setUserProfile(getUserProfile());
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const login = useCallback(async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const { success, error } = await loginWithDiscord();
      if (!success && error) {
        setAuthError(error as Error);
      }
    } catch (error) {
      setAuthError(error as Error);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  return {
    user,
    userProfile,
    isAuthenticated,
    isLoading: isLoading || isAuthenticating,
    error: authError,
    login,
  };
};
