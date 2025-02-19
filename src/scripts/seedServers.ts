import { supabase } from "@/lib/supabase";

const serverNames = [
  "Gaming Haven",
  "Tech Enthusiasts",
  "Art Gallery",
  "Music Lounge",
  "Anime Club",
  "Developer Hub",
  "Book Club",
  "Movie Buffs",
  "Fitness Community",
  "Food & Cooking",
];

const descriptions = [
  "A vibrant community for gamers of all levels. Join us for daily events, tournaments, and friendly matches!",
  "Discuss the latest in technology, share tips, and get help with your tech problems.",
  "Share your artwork, get feedback, and collaborate with other artists in a supportive environment.",
  "For music lovers! Share your favorite tracks, discuss genres, and discover new artists.",
  "Everything anime and manga! Join us for watch parties and discussions.",
  "A space for developers to collaborate, share knowledge, and get help with coding.",
  "Connect with fellow book lovers, discuss your favorite reads, and discover new authors.",
  "Discuss movies, share recommendations, and join our weekly movie nights!",
  "Stay motivated with workout buddies, share tips, and track your fitness journey.",
  "Share recipes, cooking tips, and food photos with fellow food enthusiasts.",
];

const tagSets = [
  ["gaming", "esports", "community"],
  ["technology", "programming", "gadgets"],
  ["art", "creative", "digital"],
  ["music", "entertainment", "social"],
  ["anime", "manga", "japanese"],
  ["coding", "development", "opensource"],
  ["books", "reading", "literature"],
  ["movies", "cinema", "entertainment"],
  ["fitness", "health", "workout"],
  ["food", "cooking", "recipes"],
];

const bannerImages = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
];

export async function seedServers() {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Delete all existing servers and their tags
    const { error: deleteTagsError } = await supabase
      .from("server_tags")
      .delete()
      .eq("server_id", "*");

    const { error: deleteServersError } = await supabase
      .from("servers")
      .delete()
      .eq("owner_id", user.id);

    if (deleteTagsError) throw deleteTagsError;
    if (deleteServersError) throw deleteServersError;

    // Create 10 new servers
    for (let i = 0; i < 10; i++) {
      // Create server
      const memberCount = Math.floor(Math.random() * 9000) + 1000; // Random between 1000-10000
      const { data: server, error: serverError } = await supabase
        .from("servers")
        .insert({
          name: serverNames[i],
          description: descriptions[i],
          banner_url: bannerImages[i],
          invite_url: `https://discord.gg/${Math.random().toString(36).substring(7)}`,
          member_count: memberCount,
          owner_id: user.id,
        })
        .select()
        .single();

      if (serverError) throw serverError;

      // Create tags for the server
      const serverTags = tagSets[i].map((tag) => ({
        server_id: server.id,
        tag: tag,
      }));

      const { error: tagsError } = await supabase
        .from("server_tags")
        .insert(serverTags);

      if (tagsError) throw tagsError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error seeding servers:", error);
    return { success: false, error };
  }
}
