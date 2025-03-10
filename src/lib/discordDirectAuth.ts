// Direct Discord OAuth implementation (without Firebase)

const DISCORD_API_URL = "https://discord.com/api/v10";
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const REDIRECT_URI =
  import.meta.env.VITE_DISCORD_REDIRECT_URI ||
  "http://localhost:5173/auth/callback";

// Generate the Discord OAuth URL
export const getDiscordAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "identify email guilds",
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};

// Exchange code for token
export const exchangeCodeForToken = async (code: string) => {
  try {
    console.log("Exchanging code for token:", code);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    });

    console.log("Request params:", params.toString());
    console.log("Redirect URI:", REDIRECT_URI);

    const response = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);

    if (!response.ok) {
      throw new Error(
        `Discord API error: ${response.status} - ${responseText}`,
      );
    }

    // Parse the response text as JSON
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};

// Get user info with token
export const getDiscordUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Discord user info:", error);
    throw error;
  }
};

// Get user guilds with token
export const getDiscordUserGuilds = async (accessToken: string) => {
  try {
    const response = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Discord user guilds:", error);
    throw error;
  }
};

// Direct login with Discord (without Firebase)
export const loginWithDiscordDirect = () => {
  const authUrl = getDiscordAuthUrl();
  window.location.href = authUrl;
};
