import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServers, signOutUser } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ServerCard from "@/components/dashboard/ServerCard";
import AddServerDialog from "@/components/dashboard/AddServerDialog";
import { Server, ServerTag } from "@/types/firebase";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

// Server type is imported from @/types/firebase

export default function Dashboard() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const data = await getServers({ ownerId: user.uid });
      setServers(data as Server[]);
    } catch (error) {
      console.error("Error fetching servers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, [navigate]);

  const handleJoinServer = (inviteUrl: string) => {
    window.open(inviteUrl, "_blank");
  };

  const handleLogout = async () => {
    await signOutUser();
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
    <div className="min-h-screen p-8 bg-[#1b1e23]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              My Discord Servers
            </h1>
            <p className="text-zinc-400 mt-1">Manage your published servers</p>
          </div>
          <div className="flex gap-4">
            <AddServerDialog onServerAdded={fetchServers} />
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="gap-2 bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800"
            >
              Admin
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onJoin={handleJoinServer}
                onDelete={fetchServers}
                showDeleteButton
              />
            ))}
          </div>
        </TooltipProvider>

        {servers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">
              You haven't published any servers yet. Add your first server!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
