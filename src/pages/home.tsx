import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServers } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ServerCard from "@/components/dashboard/ServerCard";
import { Server, ServerTag } from "@/types/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import Banner from "@/components/home/Banner";
import { Label } from "./../components/ui/label";
import { TooltipProvider } from "@/components/ui/tooltip";

// Server type is imported from @/types/firebase

export default function HomePage() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [minMembers, setMinMembers] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      try {
        const data = await getServers({
          orderByField: "last_bumped",
          orderDirection: "desc",
        });
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
      (server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.server_tags.some((tag) =>
          tag.tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )) &&
      server.member_count >= minMembers,
  );

  const handleJoinServer = (inviteUrl: string) => {
    window.open(inviteUrl, "_blank");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-white">Loading servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d3349]">
      <Banner />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#NaNNaNNaN] bg-[#2d3349]">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full flex justify-between items-center">
            <h1 className="font-bold text-white text-[30.75px]">
              Discord Server List
            </h1>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              >
                Login with Discord
              </Button>
            )}
          </div>
          <div className="font-extrabold tracking-tight lg:text-5xl text-center 2xl:text-base text-[#fffbfb] flex leading-[45px] h-[149.963px] flex-wrap items-center justify-center text-[25.5px] shrink">
            We help you find the right Discord Server for you ❤️
          </div>
          <div className="w-full space-y-4">
            <div className="w-full relative mx-auto max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search servers by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400 h-12 text-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Chill",
                "Fun",
                "Gaming",
                "NSFW",
                "18+",
                "Community",
                "Entertainment",
                "Social",
              ].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  className={
                    ` border-zinc-700 hover:bg-zinc-800 transition-all ${searchQuery.toLowerCase() === tag.toLowerCase() ? " border-[#5865F2] text-white" : "text-zinc-400"} ` +
                    " bg-[#171b2b] justify-between rounded-lg shrink-0 grow-0 italic"
                  }
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-row">
              {filteredServers.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  onJoin={handleJoinServer}
                  className="flex flex-wrap content-center"
                />
              ))}
            </div>
          </TooltipProvider>
          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400">
                No servers found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
