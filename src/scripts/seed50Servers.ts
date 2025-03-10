import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const serverData = [
  {
    name: "Gaming Legends",
    description:
      "A community for competitive gamers and esports enthusiasts. Join tournaments and improve your skills!",
    tags: ["Gaming", "Esports", "Competitive"],
    banner:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    members: 12500,
  },
  {
    name: "Anime Universe",
    description:
      "Discuss your favorite anime series, share fan art, and join watch parties with fellow anime lovers.",
    tags: ["Anime", "Manga", "Japanese"],
    banner:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    members: 8700,
  },
  {
    name: "Coding Wizards",
    description:
      "A hub for programmers of all levels. Get help with coding problems and collaborate on projects.",
    tags: ["Programming", "Development", "Tech"],
    banner:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    members: 6300,
  },
  {
    name: "Music Lounge",
    description:
      "Share your favorite tracks, discover new artists, and discuss music production techniques.",
    tags: ["Music", "Production", "Artists"],
    banner:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    members: 9200,
  },
  {
    name: "Art Gallery",
    description:
      "A creative space for artists to share their work, get feedback, and find inspiration.",
    tags: ["Art", "Creative", "Design"],
    banner:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    members: 7400,
  },
  {
    name: "Movie Buffs",
    description:
      "Discuss films, share reviews, and join movie nights with fellow cinema enthusiasts.",
    tags: ["Movies", "Cinema", "Entertainment"],
    banner:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    members: 5600,
  },
  {
    name: "Book Club",
    description:
      "A community for book lovers to discuss literature, share recommendations, and participate in reading challenges.",
    tags: ["Books", "Reading", "Literature"],
    banner:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    members: 4800,
  },
  {
    name: "Fitness Freaks",
    description:
      "Get motivated, share workout routines, and discuss nutrition with fitness enthusiasts.",
    tags: ["Fitness", "Health", "Workout"],
    banner:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    members: 10200,
  },
  {
    name: "Foodie Haven",
    description:
      "Share recipes, cooking tips, and food photos with fellow culinary enthusiasts.",
    tags: ["Food", "Cooking", "Recipes"],
    banner:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    members: 8300,
  },
  {
    name: "Travel Explorers",
    description:
      "Share travel experiences, get destination recommendations, and plan trips with fellow adventurers.",
    tags: ["Travel", "Adventure", "Photography"],
    banner:
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
    members: 7100,
  },
  {
    name: "Science Enthusiasts",
    description:
      "Discuss scientific discoveries, share research, and explore the wonders of the universe.",
    tags: ["Science", "Research", "Education"],
    banner:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    members: 5400,
  },
  {
    name: "Pet Lovers",
    description:
      "Share cute pet photos, get advice on pet care, and connect with other animal enthusiasts.",
    tags: ["Pets", "Animals", "Cute"],
    banner:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    members: 9800,
  },
  {
    name: "Fashion Forward",
    description:
      "Discuss fashion trends, share outfit ideas, and get style advice from fashion enthusiasts.",
    tags: ["Fashion", "Style", "Trends"],
    banner:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    members: 6700,
  },
  {
    name: "Tech Talk",
    description:
      "Stay updated on the latest tech news, discuss gadgets, and get help with tech problems.",
    tags: ["Technology", "Gadgets", "News"],
    banner:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    members: 8200,
  },
  {
    name: "Photography Club",
    description:
      "Share your best shots, get feedback, and learn photography techniques from fellow enthusiasts.",
    tags: ["Photography", "Camera", "Creative"],
    banner:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    members: 7500,
  },
  {
    name: "Crypto Traders",
    description:
      "Discuss cryptocurrency investments, share market analysis, and stay updated on blockchain technology.",
    tags: ["Crypto", "Blockchain", "Finance"],
    banner:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    members: 6100,
  },
  {
    name: "Mental Health Support",
    description:
      "A safe space for discussing mental health, sharing experiences, and providing mutual support.",
    tags: ["Mental Health", "Support", "Wellness"],
    banner:
      "https://images.unsplash.com/photo-1474377207190-a7d8b3334068?w=800&q=80",
    members: 5200,
  },
  {
    name: "DIY Projects",
    description:
      "Share your DIY creations, get project ideas, and learn new crafting skills.",
    tags: ["DIY", "Crafts", "Hobbies"],
    banner:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
    members: 6800,
  },
  {
    name: "Language Exchange",
    description:
      "Practice languages with native speakers, share learning resources, and make international friends.",
    tags: ["Languages", "Learning", "International"],
    banner:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    members: 7300,
  },
  {
    name: "Meme Central",
    description:
      "Share and enjoy the latest memes, funny videos, and internet humor.",
    tags: ["Memes", "Humor", "Fun"],
    banner:
      "https://images.unsplash.com/photo-1513031300226-c8fb12de9ade?w=800&q=80",
    members: 15000,
  },
  {
    name: "Indie Game Devs",
    description:
      "Connect with indie game developers, share your projects, and get feedback on your games.",
    tags: ["Game Dev", "Indie", "Development"],
    banner:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    members: 4900,
  },
  {
    name: "Music Producers",
    description:
      "Share your tracks, get feedback, and discuss music production techniques with fellow producers.",
    tags: ["Production", "Beats", "Audio"],
    banner:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    members: 6200,
  },
  {
    name: "Web3 Developers",
    description:
      "Discuss blockchain development, smart contracts, and decentralized applications.",
    tags: ["Web3", "Blockchain", "Development"],
    banner:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
    members: 5300,
  },
  {
    name: "Pixel Artists",
    description:
      "Share your pixel art, get feedback, and learn new techniques from fellow pixel artists.",
    tags: ["Pixel Art", "Digital Art", "Retro"],
    banner:
      "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=800&q=80",
    members: 4200,
  },
  {
    name: "UI/UX Designers",
    description:
      "Discuss design trends, share your work, and get feedback from fellow UI/UX designers.",
    tags: ["UI", "UX", "Design"],
    banner:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    members: 5800,
  },
  {
    name: "Streaming Squad",
    description:
      "Connect with streamers, share tips, and grow your audience with fellow content creators.",
    tags: ["Streaming", "Content", "Twitch"],
    banner:
      "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=800&q=80",
    members: 7800,
  },
  {
    name: "Cosplay Community",
    description:
      "Share your cosplay creations, get costume tips, and connect with fellow cosplayers.",
    tags: ["Cosplay", "Costume", "Convention"],
    banner:
      "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
    members: 6400,
  },
  {
    name: "Tabletop Gamers",
    description:
      "Discuss board games, RPGs, and tabletop gaming with fellow enthusiasts.",
    tags: ["Board Games", "RPG", "Tabletop"],
    banner:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80",
    members: 5100,
  },
  {
    name: "Sneakerheads",
    description:
      "Discuss sneaker releases, share your collection, and connect with fellow sneaker enthusiasts.",
    tags: ["Sneakers", "Fashion", "Collecting"],
    banner:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    members: 7200,
  },
  {
    name: "Plant Parents",
    description:
      "Share plant care tips, get advice on your houseplants, and connect with fellow plant enthusiasts.",
    tags: ["Plants", "Gardening", "Houseplants"],
    banner:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
    members: 6500,
  },
  {
    name: "Coffee Connoisseurs",
    description:
      "Discuss coffee brewing methods, share your favorite beans, and connect with fellow coffee lovers.",
    tags: ["Coffee", "Brewing", "Beans"],
    banner:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    members: 5700,
  },
  {
    name: "Startup Founders",
    description:
      "Connect with fellow entrepreneurs, share business advice, and discuss startup challenges.",
    tags: ["Startup", "Business", "Entrepreneurship"],
    banner:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    members: 4800,
  },
  {
    name: "3D Artists",
    description:
      "Share your 3D models, get feedback, and discuss 3D modeling techniques with fellow artists.",
    tags: ["3D", "Modeling", "Rendering"],
    banner:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80",
    members: 5200,
  },
  {
    name: "Podcast Enthusiasts",
    description:
      "Discuss your favorite podcasts, share recommendations, and connect with fellow podcast lovers.",
    tags: ["Podcasts", "Audio", "Entertainment"],
    banner:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80",
    members: 4600,
  },
  {
    name: "Vintage Collectors",
    description:
      "Share your vintage finds, discuss collectibles, and connect with fellow collectors.",
    tags: ["Vintage", "Collecting", "Antiques"],
    banner:
      "https://images.unsplash.com/photo-1472421883626-5e0020f2e0b1?w=800&q=80",
    members: 4300,
  },
  {
    name: "Home Chefs",
    description:
      "Share your culinary creations, get cooking tips, and discuss recipes with fellow home chefs.",
    tags: ["Cooking", "Recipes", "Food"],
    banner:
      "https://images.unsplash.com/photo-1556911220-bda9f7f6b548?w=800&q=80",
    members: 8900,
  },
  {
    name: "Writers Workshop",
    description:
      "Share your writing, get feedback, and discuss literary techniques with fellow writers.",
    tags: ["Writing", "Creative", "Literature"],
    banner:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    members: 5500,
  },
  {
    name: "Car Enthusiasts",
    description:
      "Discuss cars, share your rides, and connect with fellow automotive enthusiasts.",
    tags: ["Cars", "Automotive", "Racing"],
    banner:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    members: 9300,
  },
  {
    name: "Drone Pilots",
    description:
      "Share your aerial photography, discuss drone technology, and connect with fellow pilots.",
    tags: ["Drones", "Aerial", "Photography"],
    banner:
      "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80",
    members: 4700,
  },
  {
    name: "Sustainable Living",
    description:
      "Share eco-friendly tips, discuss sustainability, and connect with environmentally conscious people.",
    tags: ["Eco", "Sustainability", "Green"],
    banner:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    members: 6100,
  },
  {
    name: "Cybersecurity Experts",
    description:
      "Discuss security vulnerabilities, share tips, and connect with fellow cybersecurity professionals.",
    tags: ["Security", "Hacking", "Tech"],
    banner:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    members: 5300,
  },
  {
    name: "Digital Nomads",
    description:
      "Share remote work tips, discuss travel destinations, and connect with fellow digital nomads.",
    tags: ["Remote", "Travel", "Work"],
    banner:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    members: 7400,
  },
  {
    name: "VR Enthusiasts",
    description:
      "Discuss virtual reality technology, share experiences, and connect with fellow VR enthusiasts.",
    tags: ["VR", "Virtual Reality", "Tech"],
    banner:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
    members: 4800,
  },
  {
    name: "Mechanical Keyboards",
    description:
      "Share your keyboard builds, discuss switches, and connect with fellow keyboard enthusiasts.",
    tags: ["Keyboards", "Mechanical", "Tech"],
    banner:
      "https://images.unsplash.com/photo-1595044426077-d36d9236d44a?w=800&q=80",
    members: 5200,
  },
  {
    name: "Astronomy Club",
    description:
      "Share astrophotography, discuss space discoveries, and connect with fellow astronomy enthusiasts.",
    tags: ["Astronomy", "Space", "Science"],
    banner:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&q=80",
    members: 6300,
  },
  {
    name: "Hiking Adventures",
    description:
      "Share hiking experiences, discuss trails, and connect with fellow outdoor enthusiasts.",
    tags: ["Hiking", "Outdoors", "Nature"],
    banner:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    members: 8100,
  },
  {
    name: "Retro Gaming",
    description:
      "Discuss classic video games, share your collection, and connect with fellow retro gamers.",
    tags: ["Retro", "Gaming", "Nostalgia"],
    banner:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    members: 7200,
  },
  {
    name: "Tattoo Enthusiasts",
    description:
      "Share your ink, discuss tattoo designs, and connect with fellow tattoo lovers.",
    tags: ["Tattoos", "Art", "Body Mod"],
    banner:
      "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80",
    members: 6800,
  },
  {
    name: "Meditation Circle",
    description:
      "Share meditation techniques, discuss mindfulness, and connect with fellow meditators.",
    tags: ["Meditation", "Mindfulness", "Wellness"],
    banner:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    members: 5400,
  },
];

export async function seed50Servers() {
  try {
    // Get the current user
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Create servers
    for (const server of serverData) {
      // Create server
      const serverRef = collection(db, "servers");
      const newServer = {
        name: server.name,
        description: server.description,
        banner_url: server.banner,
        invite_url: `https://discord.gg/${Math.random().toString(36).substring(7)}`,
        member_count: server.members,
        owner_id: user.uid,
        last_bumped: serverTimestamp(),
        created_at: serverTimestamp(),
      };

      const serverDoc = await addDoc(serverRef, newServer);

      // Create tags for the server
      const tagsRef = collection(db, "server_tags");
      for (const tag of server.tags) {
        await addDoc(tagsRef, {
          server_id: serverDoc.id,
          tag: tag,
        });
      }
    }

    return { success: true, message: "Successfully seeded 50 servers!" };
  } catch (error) {
    console.error("Error seeding servers:", error);
    return { success: false, error };
  }
}
