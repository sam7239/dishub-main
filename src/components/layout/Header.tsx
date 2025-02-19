import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [user, setUser] = useState<{
    user_metadata: { avatar_url?: string; full_name?: string; name?: string };
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    }
  }, [isAuthenticated]);
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
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="ghost"
                  className="text-sm font-medium hover:text-[#5865F2]"
                >
                  Dashboard
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">
                    {user?.user_metadata?.full_name ||
                      user?.user_metadata?.name ||
                      "User"}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {
                        (user?.user_metadata?.full_name ||
                          user?.user_metadata?.name ||
                          "U")?.[0]
                      }
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
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
