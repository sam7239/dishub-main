import { auth, signInWithDiscord } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Function to initiate Discord OAuth login
export const loginWithDiscord = async () => {
  try {
    const { data, error } = await signInWithDiscord();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Discord login error:", error);
    return { success: false, error };
  }
};

// Function to check if user is authenticated
export const checkAuthState = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Function to get current user profile
export const getUserProfile = () => {
  const user = auth.currentUser;
  if (!user) return null;

  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    // Discord specific data might be available in the providerData
    discordId: user.providerData[0]?.uid,
  };
};

// Function to listen for auth state changes
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
) => {
  return onAuthStateChanged(auth, callback);
};
