import { supabase } from "./supabase";

export const signInWithDiscord = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify email guilds",
      },
    });

    if (error) {
      console.error("Discord sign in error:", error);
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { data: null, error };
  }
};

export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return { session: null, error: error || new Error("No session found") };
  }
  return { session: data.session, error: null };
};
