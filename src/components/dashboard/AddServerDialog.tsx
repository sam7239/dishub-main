import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AddServerDialogProps {
  onServerAdded?: () => void;
}

export default function AddServerDialog({
  onServerAdded,
}: AddServerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    inviteUrl: "",
    bannerUrl: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: server, error: serverError } = await supabase
        .from("servers")
        .insert({
          name: formData.name,
          description: formData.description,
          invite_url: formData.inviteUrl,
          banner_url:
            formData.bannerUrl ||
            "https://images.unsplash.com/photo-1614422982208-51274e106c1e",
          owner_id: user.id,
          member_count: 0,
        })
        .select()
        .single();

      if (serverError) throw serverError;

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length > 0) {
        const { error: tagsError } = await supabase.from("server_tags").insert(
          tags.map((tag) => ({
            server_id: server.id,
            tag,
          })),
        );

        if (tagsError) throw tagsError;
      }

      setOpen(false);
      onServerAdded?.();
    } catch (error) {
      console.error("Error adding server:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Discord Server</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inviteUrl">Invite URL</Label>
            <Input
              id="inviteUrl"
              type="url"
              required
              placeholder="https://discord.gg/..."
              value={formData.inviteUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, inviteUrl: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerUrl">Banner Image URL (optional)</Label>
            <Input
              id="bannerUrl"
              type="url"
              placeholder="https://..."
              value={formData.bannerUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bannerUrl: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="gaming, community, art"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding Server..." : "Add Server"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
