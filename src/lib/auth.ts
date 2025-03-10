import {
  auth,
  signInWithDiscord as firebaseSignInWithDiscord,
} from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const signInWithDiscord = async () => {
  try {
    const { data, error } = await firebaseSignInWithDiscord();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { data: null, error };
  }
};

export const handleAuthCallback = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({ session: { user }, error: null });
      } else {
        resolve({ session: null, error: new Error("No session found") });
      }
    });
  });
};

export const getSession = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve({ data: { session: user ? { user } : null } });
    });
  });
};

export const onAuthStateChange = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback("SIGNED_IN", user ? { user } : null);
  });

  return { data: { subscription: { unsubscribe } } };
};
