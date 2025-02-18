import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar } from "./../ui/avatar";
import { AvatarImage } from "./../ui/avatar";
import { AvatarFallback } from "./../ui/avatar";
import { MessageCircle } from "lucide-react";

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-[#5865F2]" />
              <span className="text-xl font-bold">Dishub</span>
            </a>
          </div>

          <nav className="flex items-center space-x-4">
            <a href="/" className="text-sm font-medium hover:text-[#5865F2]">
              Home
            </a>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                className="text-sm font-medium hover:text-[#5865F2]"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white flex-row"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
