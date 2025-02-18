import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnlineIndicator } from "@/components/ui/online-indicator";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Server = Tables<"servers"> & { server_tags: Tables<"server_tags">[] };

interface ServerCardProps {
  server: Server;
  onJoin?: (inviteUrl: string) => void;
  activeMembers?: number;
}

export default function ServerCard({ server, onJoin }: ServerCardProps) {
  const [activeMembers, setActiveMembers] = useState(0);

  // Fetch and subscribe to active members
  useEffect(() => {
    // Fetch initial active members
    const fetchActiveMembers = async () => {
      const { count } = await supabase
        .from("presence")
        .select("*", { count: "exact", head: true })
        .eq("server_id", server.id)
        .gt("last_seen", new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      setActiveMembers(count || 0);
    };

    fetchActiveMembers();

    // Subscribe to real-time presence changes
    const presenceSubscription = supabase
      .channel(`server_${server.id}_presence`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "presence",
          filter: `server_id=eq.${server.id}`,
        },
        async () => {
          const { count } = await supabase
            .from("presence")
            .select("*", { count: "exact", head: true })
            .eq("server_id", server.id)
            .gt(
              "last_seen",
              new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            );

          setActiveMembers(count || 0);
        },
      )
      .subscribe();

    return () => {
      presenceSubscription.unsubscribe();
    };
  }, [server.id]);

  return (
    <Card className="w-full max-w-sm bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div
        className="h-40 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${server.banner_url})` }}
      >
        <div className="absolute bottom-2 left-2">
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={server.profile_url} alt={server.name} />
                <AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Server Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-semibold text-lg">{server.name}</h1>
            <p className="text-sm text-muted-foreground">
              {server.member_count.toLocaleString()} members
            </p>
            <div className="flex items-center mt-1">
              <OnlineIndicator />
              <span className="text-sm text-green-600 ml-1">
                {activeMembers.toLocaleString()} active now
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {server.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {server.server_tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="bg-[#5865F2] text-white"
            >
              {tag.tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 rounded-lg transition-colors duration-300"
          onClick={() => onJoin?.(server.invite_url)}
        >
          Join Server
        </Button>
      </CardFooter>
    </Card>
  );
}
