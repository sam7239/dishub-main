import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoadingOverlay from "@/components/auth/LoadingOverlay";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if user is authenticated
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // Successfully authenticated
            navigate("/dashboard");
          } else {
            // No user found
            navigate("/login?error=auth-failed");
          }
        });

        return () => unsubscribe();
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
