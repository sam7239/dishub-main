import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ServerCard from "@/components/dashboard/ServerCard";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

type Server = Tables<"servers"> & { server_tags: Tables<"server_tags">[] };

export default function HomePage() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data, error } = await supabase.from("servers").select(`
            *,
            server_tags (*)
          `);

        if (error) throw error;
        setServers(data as Server[]);
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const filteredServers = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.server_tags.some((tag) =>
        tag.tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const handleJoinServer = (inviteUrl: string) => {
    window.open(inviteUrl, "_blank");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-foreground">Loading servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-4xl font-bold text-foreground">
              Discord Servers
            </h1>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                Login with Discord
              </Button>
            )}
          </div>

          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search servers by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredServers.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  onJoin={handleJoinServer}
                />
              ))}
            </div>
          </TooltipProvider>

          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No servers found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
