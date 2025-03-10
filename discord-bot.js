const { Client, GatewayIntentBits } = require("discord.js");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} = require("firebase/firestore");

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "!bump") {
    if (!message.guild) {
      message.reply("This command can only be used in a server!");
      return;
    }
    try {
      // Find the server in our database
      const serversRef = collection(db, "servers");
      const q = query(serversRef, where("discord_id", "==", message.guild.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        message.reply("This server is not registered on Dishub!");
        return;
      }

      const serverDoc = querySnapshot.docs[0];
      const server = { id: serverDoc.id, ...serverDoc.data() };

      // Rate limit check
      const rateLimit = await checkRateLimit(message.author.id);
      if (rateLimit) {
        message.reply(`Please wait ${rateLimit} minutes before bumping again.`);
        return;
      }

      // Check if enough time has passed since last bump (2 hours)
      const lastBumped = server.last_bumped
        ? new Date(server.last_bumped.toDate())
        : null;
      const now = new Date();
      const hoursSinceLastBump = lastBumped
        ? (now.getTime() - lastBumped.getTime()) / (1000 * 60 * 60)
        : 999;

      if (hoursSinceLastBump < 2) {
        const timeLeft = Math.ceil(2 - hoursSinceLastBump);
        message.reply(`You can bump again in ${timeLeft} hour(s)!`);
        return;
      }

      // Update the last_bumped timestamp
      const serverRef = doc(db, "servers", server.id);
      await updateDoc(serverRef, { last_bumped: now });

      message.reply("Server bumped successfully! 🚀");
    } catch (error) {
      console.error("Error handling bump:", error);
      message.reply("An error occurred while bumping the server.");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
