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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUp, Trash2 } from "lucide-react";
import EditServerDialog from "./EditServerDialog";

type Server = Tables<"servers"> & { server_tags: Tables<"server_tags">[] };

interface ServerCardProps {
  server: Server;
  onJoin?: (inviteUrl: string) => void;
  onDelete?: () => void;
  activeMembers?: number;
  showDeleteButton?: boolean;
}

export default function ServerCard({
  server,
  onJoin,
  onDelete,
  showDeleteButton = false,
}: ServerCardProps) {
  const [activeMembers, setActiveMembers] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const [lastBumped, setLastBumped] = useState<Date | null>(
    server.last_bumped ? new Date(server.last_bumped) : null,
  );

  // Fetch and subscribe to active members
  useEffect(() => {
    // Fetch initial active members
    const fetchActiveMembers = async () => {
      const { count } = await supabase
        .from("presence")
        .select("*", { count: "exact", head: true })
        .eq("server_id", server.id)
        .eq("online", true); // Assuming presence table has an 'online' boolean column

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
            .eq("online", true); // Again, using 'online' column

          setActiveMembers(count || 0);
        },
      )
      .subscribe();

    return () => {
      presenceSubscription.unsubscribe();
    };
  }, [server.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete server tags first
      await supabase.from("server_tags").delete().eq("server_id", server.id);

      // Then delete the server
      await supabase.from("servers").delete().eq("id", server.id);

      onDelete?.();
    } catch (error) {
      console.error("Error deleting server:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBump = async () => {
    setIsBumping(true);
    try {
      const { error } = await supabase
        .from("servers")
        .update({ last_bumped: new Date().toISOString() })
        .eq("id", server.id);

      if (error) throw error;
      setLastBumped(new Date());
    } catch (error) {
      console.error("Error bumping server:", error);
    } finally {
      setIsBumping(false);
    }
  };

  const canBump =
    !lastBumped || Date.now() - lastBumped.getTime() > 2 * 60 * 60 * 1000;

  return (
    <Card className="w-full max-w-sm bg-zinc-900 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-zinc-800">
      <div
        className="h-40 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${server.banner_url})` }}
      >
        <div className="absolute bottom-2 left-2">
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="h-12 w-12 border-2 border-zinc-800">
                <AvatarImage src={server.profile_url} alt={server.name} />
                <AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Server Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {showDeleteButton && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={`h-8 w-8 ${canBump ? "bg-[#5865F2] hover:bg-[#4752C4]" : "bg-zinc-700"}`}
                  onClick={handleBump}
                  disabled={!canBump || isBumping}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {canBump
                    ? "Bump Server"
                    : "Can bump again in " +
                      Math.ceil(
                        2 -
                          (Date.now() - (lastBumped?.getTime() || 0)) /
                            (60 * 60 * 1000),
                      ) +
                      " hours"}
                </p>
              </TooltipContent>
            </Tooltip>
            <EditServerDialog server={server} onServerUpdated={onDelete} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Delete Server
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Are you sure you want to delete {server.name}? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-semibold text-lg text-white">{server.name}</h1>
            <p className="text-sm text-zinc-400">
              {server.member_count.toLocaleString()} members
            </p>
            <div className="flex items-center mt-1">
              <OnlineIndicator />
              <span className="text-sm text-green-500 ml-1">
                {activeMembers.toLocaleString()} active now
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-300 line-clamp-3 mb-4">
          {server.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {server.server_tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="bg-[#5865F2] text-white hover:bg-[#4752C4]"
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
