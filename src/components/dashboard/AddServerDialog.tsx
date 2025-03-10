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
import { createServer } from "@/lib/firebase";

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
    tags: [],
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
      await createServer({
        name: formData.name,
        description: formData.description,
        invite_url: formData.inviteUrl,
        banner_url:
          formData.bannerUrl ||
          "https://images.unsplash.com/photo-1614422982208-51274e106c1e",
        member_count: 0,
        tags: formData.tags,
      });

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
            <Label htmlFor="bannerUrl">Banner Image URL (required)</Label>
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
            {loading ? "Adding Server..." : "Add Server"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
