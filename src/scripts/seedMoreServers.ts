import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const additionalServers = [
  {
    name: "Crypto Traders",
    description:
      "Join our community of cryptocurrency enthusiasts. Daily market analysis, trading tips, and investment strategies.",
    tags: ["crypto", "finance", "trading"],
    banner: "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
    members: 5200,
  },
  {
    name: "Pixel Artists",
    description:
      "A community for pixel art creators and enthusiasts. Share your work, get feedback, and participate in weekly challenges.",
    tags: ["art", "pixel", "creative"],
    banner: "https://images.unsplash.com/photo-1633412802994-5c058f151b66",
    members: 3800,
  },
  {
    name: "Web3 Developers",
    description:
      "Connect with blockchain developers, discuss the latest in Web3 technology, and collaborate on decentralized projects.",
    tags: ["coding", "blockchain", "web3"],
    banner: "https://images.unsplash.com/photo-1639762681057-408e52192e55",
    members: 7300,
  },
  {
    name: "Fitness Motivation",
    description:
      "Stay motivated on your fitness journey. Daily workouts, nutrition advice, and a supportive community to help you reach your goals.",
    tags: ["fitness", "health", "workout"],
    banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    members: 12500,
  },
  {
    name: "Language Exchange",
    description:
      "Practice languages with native speakers. Voice channels for conversation practice, language resources, and cultural exchange.",
    tags: ["language", "learning", "international"],
    banner: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    members: 8900,
  },
  {
    name: "Music Producers",
    description:
      "For beatmakers, producers, and music creators. Share your tracks, get feedback, and collaborate with other artists.",
    tags: ["music", "production", "beats"],
    banner: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
    members: 6700,
  },
  {
    name: "Indie Game Devs",
    description:
      "A community for independent game developers. Share your projects, get technical help, and connect with other creators.",
    tags: ["gamedev", "indie", "programming"],
    banner: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f",
    members: 4500,
  },
  {
    name: "Photography Club",
    description:
      "Share your best shots, get constructive feedback, and improve your photography skills with like-minded enthusiasts.",
    tags: ["photography", "creative", "art"],
    banner: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    members: 9200,
  },
  {
    name: "Mental Health Support",
    description:
      "A safe space for mental health support and resources. Connect with others, share experiences, and find community.",
    tags: ["health", "support", "community"],
    banner: "https://images.unsplash.com/photo-1474377207190-a7d8b3334068",
    members: 5800,
  },
  {
    name: "UI/UX Designers",
    description:
      "For designers focused on user experience and interface design. Share your work, discuss trends, and get career advice.",
    tags: ["design", "ui", "ux"],
    banner: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    members: 7100,
  },
];

export async function seedMoreServers() {
  try {
    // Get the current user
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Create additional servers
    for (const serverData of additionalServers) {
      // Create server
      const serverRef = collection(db, "servers");
      const newServer = {
        name: serverData.name,
        description: serverData.description,
        banner_url: serverData.banner,
        invite_url: `https://discord.gg/${Math.random().toString(36).substring(7)}`,
        member_count: serverData.members,
        owner_id: user.uid,
        last_bumped: serverTimestamp(),
        created_at: serverTimestamp(),
      };

      const serverDoc = await addDoc(serverRef, newServer);

      // Create tags for the server
      const tagsRef = collection(db, "server_tags");
      for (const tag of serverData.tags) {
        await addDoc(tagsRef, {
          server_id: serverDoc.id,
          tag: tag,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error seeding additional servers:", error);
    return { success: false, error };
  }
}
