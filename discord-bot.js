const { Client, GatewayIntentBits } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

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
      const { data: server, error } = await supabase
        .from("servers")
        .select("*, server_tags(*)")
        .eq("discord_id", message.guild.id)
        .single();

      // Rate limit check
      const rateLimit = await checkRateLimit(message.author.id);
      if (rateLimit) {
        message.reply(`Please wait ${rateLimit} minutes before bumping again.`);
        return;
      }

      if (error || !server) {
        message.reply("This server is not registered on Dishub!");
        return;
      }

      // Check if enough time has passed since last bump (2 hours)
      const lastBumped = server.last_bumped
        ? new Date(server.last_bumped)
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
      const { error: updateError } = await supabase
        .from("servers")
        .update({ last_bumped: now.toISOString() })
        .eq("id", server.id);

      if (updateError) throw updateError;

      message.reply("Server bumped successfully! 🚀");
    } catch (error) {
      console.error("Error handling bump:", error);
      message.reply("An error occurred while bumping the server.");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
