import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, ServerTag } from "@/types/firebase";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnlineIndicator } from "@/components/ui/online-indicator";
import { useEffect, useState } from "react";
import { getCurrentUser, deleteServer, bumpServer } from "@/lib/firebase";
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
import { ArrowUp, Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditServerDialog from "./EditServerDialog";

// Server type is imported from @/types/firebase

interface ServerCardProps {
  server: Server;
  onJoin?: (inviteUrl: string) => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  className?: string;
}

export default function ServerCard({
  server,
  onJoin,
  onDelete,
  showDeleteButton = false,
  className = "",
}: ServerCardProps) {
  const [activeMembers, setActiveMembers] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const [lastBumped, setLastBumped] = useState<Date | null>(
    server.last_bumped ? new Date(server.last_bumped) : null,
  );
  const [canBump, setCanBump] = useState(true);
  const [showBumpSuccess, setShowBumpSuccess] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Calculate active members based on total members (10%)
    const calculatedActive = Math.floor(server.member_count * 0.1);
    setActiveMembers(Math.min(calculatedActive, 1000)); // Cap at 1000 active members
  }, [server.member_count]);

  useEffect(() => {
    // Check if current user is the owner
    const checkOwnership = async () => {
      const user = getCurrentUser();
      setIsOwner(user?.uid === server.owner_id);
    };
    checkOwnership();
  }, [server.owner_id]);

  useEffect(() => {
    if (!lastBumped) return;
    const timeSinceLastBump = Date.now() - lastBumped.getTime();
    const hoursLeft = 2 - timeSinceLastBump / (1000 * 60 * 60);
    setCanBump(hoursLeft <= 0);
  }, [lastBumped]);

  const handleDelete = async () => {
    if (!isOwner) return;
    setIsDeleting(true);
    try {
      await deleteServer(server.id);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting server:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBump = async () => {
    if (!canBump || !isOwner) return;
    setIsBumping(true);
    try {
      await bumpServer(server.id);
      const now = new Date();
      setLastBumped(now);
      setShowBumpSuccess(true);
      setTimeout(() => setShowBumpSuccess(false), 3000);
    } catch (error) {
      console.error("Error bumping server:", error);
    } finally {
      setIsBumping(false);
    }
  };

  const handleJoin = (inviteUrl: string) => {
    // Validate Discord invite URL
    if (!inviteUrl.match(/^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/)) {
      console.error("Invalid Discord invite URL");
      return;
    }
    onJoin?.(inviteUrl);
  };

  return (
    <Card
      className={`w-full max-w-sm bg-zinc-900 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-zinc-800 h-[500px] flex flex-col ${className}`}
    >
      <div
        className="h-40 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${server.banner_url})` }}
      >
        {showDeleteButton && isOwner && (
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
                    : `Can bump again in ${Math.ceil(
                        2 -
                          (Date.now() - (lastBumped?.getTime() || 0)) /
                            (60 * 60 * 1000),
                      )} hours`}
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
      <CardContent className="flex-grow">
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
          onClick={() => handleJoin(server.invite_url)}
        >
          Join Server
        </Button>
      </CardFooter>
      {lastBumped && (
        <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 pb-4">
          <Clock className="h-3 w-3" />
          <span>
            Bumped {Math.floor((Date.now() - lastBumped.getTime()) / 60000)}{" "}
            minutes ago
          </span>
        </div>
      )}
      <Dialog open={showBumpSuccess} onOpenChange={setShowBumpSuccess}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Server Bumped!</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Your server has been bumped to the top of the list. You can bump
              again in 2 hours.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
