import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedServers } from "@/scripts/seedServers";
import { seedMoreServers } from "@/scripts/seedMoreServers";
import { seed50Servers } from "@/scripts/seed50Servers";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "@/lib/firebase";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSeedServers = async () => {
    setLoading(true);
    setMessage("Seeding servers...");
    try {
      const result = await seedServers();
      if (result.success) {
        setMessage("Successfully seeded 10 servers!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedMoreServers = async () => {
    setLoading(true);
    setMessage("Seeding additional servers...");
    try {
      const result = await seedMoreServers();
      if (result.success) {
        setMessage("Successfully seeded 10 more servers!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed50Servers = async () => {
    setLoading(true);
    setMessage("Seeding 50 diverse servers...");
    try {
      const result = await seed50Servers();
      if (result.success) {
        setMessage(result.message || "Successfully seeded 50 servers!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

        <div className="space-y-4">
          <div>
            <Button
              onClick={handleSeedServers}
              disabled={loading}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] mb-2"
            >
              {loading ? "Processing..." : "Seed 10 Basic Servers"}
            </Button>
            <Button
              onClick={handleSeedMoreServers}
              disabled={loading}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] mb-2"
            >
              {loading ? "Processing..." : "Seed 10 More Servers"}
            </Button>
            <Button
              onClick={handleSeed50Servers}
              disabled={loading}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
            >
              {loading ? "Processing..." : "Seed 50 Diverse Servers"}
            </Button>
          </div>

          {message && (
            <div className="p-3 rounded bg-zinc-800 text-white text-sm">
              {message}
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full mb-2 border-zinc-700 text-white"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
