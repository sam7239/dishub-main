import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ServerCard from "@/components/dashboard/ServerCard";
import AddServerDialog from "@/components/dashboard/AddServerDialog";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

type Server = Tables<"servers"> & { server_tags: Tables<"server_tags">[] };

export default function Dashboard() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("servers")
        .select(
          `
          *,
          server_tags (*)
        `,
        )
        .eq("owner_id", session.user.id);

      if (error) throw error;
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
    await supabase.auth.signOut();
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Discord Servers
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your published servers
            </p>
          </div>
          <div className="flex gap-4">
            <AddServerDialog onServerAdded={fetchServers} />
            <Button variant="outline" onClick={handleLogout} className="gap-2">
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
              />
            ))}
          </div>
        </TooltipProvider>

        {servers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You haven't published any servers yet. Add your first server!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
