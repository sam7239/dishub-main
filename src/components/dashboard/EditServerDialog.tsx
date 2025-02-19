import { useState, useEffect } from "react";
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
import { Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

type Server = Tables<"servers"> & { server_tags: Tables<"server_tags">[] };

interface EditServerDialogProps {
  server: Server;
  onServerUpdated?: () => void;
}

export default function EditServerDialog({
  server,
  onServerUpdated,
}: EditServerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: server.name,
    description: server.description,
    inviteUrl: server.invite_url,
    bannerUrl: server.banner_url,
    tags: server.server_tags.map((tag) => tag.tag),
  });

  const availableTags = [
    "Chill",
    "Fun",
    "Gaming",
    "NSFW",
    "18+",
    "Community",
    "Entertainment",
    "Social",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update server details
      const { error: serverError } = await supabase
        .from("servers")
        .update({
          name: formData.name,
          description: formData.description,
          invite_url: formData.inviteUrl,
          banner_url: formData.bannerUrl,
        })
        .eq("id", server.id);

      if (serverError) throw serverError;

      // Delete existing tags
      await supabase.from("server_tags").delete().eq("server_id", server.id);

      // Add new tags
      if (formData.tags.length > 0) {
        const { error: tagsError } = await supabase.from("server_tags").insert(
          formData.tags.map((tag) => ({
            server_id: server.id,
            tag,
          })),
        );

        if (tagsError) throw tagsError;
      }

      setOpen(false);
      onServerUpdated?.();
    } catch (error) {
      console.error("Error updating server:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-zinc-800 hover:bg-zinc-700"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Server</DialogTitle>
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
            <Label htmlFor="bannerUrl">Banner Image URL (required)</Label>
            <Input
              id="bannerUrl"
              type="url"
              required
              placeholder="https://..."
              value={formData.bannerUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bannerUrl: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (select at least one)</Label>
            <div className="flex flex-wrap gap-2 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  className={`
                    border-zinc-700 hover:bg-zinc-800 transition-all
                    ${formData.tags.includes(tag) ? "bg-[#5865F2] border-[#5865F2] text-white" : "text-zinc-400"}
                  `}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags.filter((t) => t !== tag)
                        : [...prev.tags, tag],
                    }));
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              loading || !formData.bannerUrl || formData.tags.length === 0
            }
          >
            {loading ? "Updating Server..." : "Update Server"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
