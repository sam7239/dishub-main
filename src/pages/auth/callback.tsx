import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import LoadingOverlay from "@/components/auth/LoadingOverlay";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (!session) throw new Error("No session found");

        // Successfully authenticated
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login?error=auth-failed");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <LoadingOverlay isLoading={true} message="Completing authentication..." />
  );
};

export default AuthCallback;
