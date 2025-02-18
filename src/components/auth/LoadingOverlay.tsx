import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading?: boolean;
  message?: string;
}

const LoadingOverlay = ({
  isLoading = true,
  message = "Authenticating with Discord...",
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-[#5865F2]" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
