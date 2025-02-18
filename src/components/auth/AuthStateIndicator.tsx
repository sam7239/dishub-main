import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthState = "idle" | "loading" | "success" | "error";

interface AuthStateIndicatorProps {
  state?: AuthState;
  message?: string;
  className?: string;
}

const AuthStateIndicator = ({
  state = "idle",
  message = "Please log in with Discord",
  className,
}: AuthStateIndicatorProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 space-y-2 bg-white rounded-lg border",
        className,
      )}
    >
      {state === "loading" && (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-discord-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {state === "success" && (
        <div className="flex items-center justify-center text-green-500">
          <CheckCircle className="w-8 h-8" />
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center justify-center text-red-500">
          <XCircle className="w-8 h-8" />
        </div>
      )}

      <p
        className={cn(
          "text-sm font-medium",
          state === "error" && "text-red-500",
          state === "success" && "text-green-500",
          state === "loading" && "text-discord-blue",
          state === "idle" && "text-gray-600",
        )}
      >
        {message}
      </p>
    </div>
  );
};

export default AuthStateIndicator;
