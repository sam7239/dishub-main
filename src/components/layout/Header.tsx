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
    <header className="border-b bg-[#NaNNaNNaN] from-[#c72a2a] bg-[#5a67fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-[#5865F2]" />
              <span className="text-xl font-bold bg-inherit text-[#ffffff]">
                Dishub
              </span>
            </a>
          </div>

          <nav className="flex items-center space-x-4 text-[#feffff]">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#fffefe]">
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
              <></>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
