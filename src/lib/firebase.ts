import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  OAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// For development, use mock config if env vars aren't set
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "mock-project-id.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "mock-project-id.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef1234567890",
};

// For development, create mock implementations
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    callback(null);
    return () => {};
  },
  signInWithPopup: async () => {
    const mockUser = {
      uid: "mock-user-id",
      email: "mock@example.com",
      displayName: "Mock User",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=mockuser",
    };
    mockAuth.currentUser = mockUser;
    return { user: mockUser };
  },
  signOut: async () => {
    mockAuth.currentUser = null;
    return Promise.resolve();
  },
};

const mockDb = {
  collection: () => ({
    docs: [],
    get: async () => ({ docs: [] }),
  }),
  doc: () => ({
    get: async () => ({ exists: () => false, data: () => ({}) }),
  }),
  addDoc: async () => ({ id: "mock-doc-id" }),
  getDoc: async () => ({ exists: () => false, data: () => ({}) }),
  getDocs: async () => ({ docs: [] }),
  updateDoc: async () => ({}),
  deleteDoc: async () => ({}),
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({}),
  serverTimestamp: () => new Date(),
};

// Initialize Firebase with error handling
let app;
let auth = mockAuth;
let db = mockDb;

// Only try to initialize Firebase if we're in a browser environment
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Using mock Firebase implementation:", error);
  }
}

// Discord OAuth provider - only create if we're not using mock auth
let discordProvider;
try {
  discordProvider = new OAuthProvider("discord.com");
  discordProvider.setCustomParameters({
    prompt: "consent",
  });
  discordProvider.addScope("identify");
  discordProvider.addScope("email");
  discordProvider.addScope("guilds");
} catch (error) {
  console.error("Error creating Discord provider:", error);
  // Will use mock auth instead
}

// Auth functions
export const signInWithDiscord = async () => {
  try {
    await signOut(auth); // Clear any existing session first

    // If we're using mock auth, handle differently
    if (auth === mockAuth) {
      const mockResult = await auth.signInWithPopup();
      return { data: mockResult, error: null };
    }

    // Real Firebase auth
    const result = await signInWithPopup(auth, discordProvider);
    return { data: result, error: null };
  } catch (error) {
    console.error("Discord sign in error:", error);
    return { data: null, error };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const signOutUser = async () => {
  return signOut(auth);
};

// Firestore helper functions
export const createServer = async (serverData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const serverRef = collection(db, "servers");
    const newServer = {
      ...serverData,
      owner_id: user.uid,
      created_at: serverTimestamp(),
      last_bumped: serverTimestamp(),
    };

    const docRef = await addDoc(serverRef, newServer);

    // Add tags if provided
    if (serverData.tags && serverData.tags.length > 0) {
      const tagsRef = collection(db, "server_tags");
      for (const tag of serverData.tags) {
        await addDoc(tagsRef, {
          server_id: docRef.id,
          tag,
        });
      }
    }

    return { id: docRef.id, ...newServer };
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
};

export const getServers = async (options = {}) => {
  try {
    const {
      ownerId,
      orderByField = "last_bumped",
      orderDirection = "desc",
    } = options;

    let q = collection(db, "servers");

    if (ownerId) {
      q = query(q, where("owner_id", "==", ownerId));
    }

    q = query(q, orderBy(orderByField, orderDirection));

    const querySnapshot = await getDocs(q);
    const servers = [];

    for (const docSnapshot of querySnapshot.docs) {
      const serverData = { id: docSnapshot.id, ...docSnapshot.data() };

      // Get tags for this server
      const tagsQuery = query(
        collection(db, "server_tags"),
        where("server_id", "==", docSnapshot.id),
      );
      const tagsSnapshot = await getDocs(tagsQuery);
      const tags = tagsSnapshot.docs.map((tagDoc) => ({
        id: tagDoc.id,
        ...tagDoc.data(),
      }));

      servers.push({
        ...serverData,
        server_tags: tags,
      });
    }

    return servers;
  } catch (error) {
    console.error("Error getting servers:", error);
    throw error;
  }
};

export const updateServer = async (serverId, updateData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // Verify ownership
    const serverRef = doc(db, "servers", serverId);
    const serverSnap = await getDoc(serverRef);

    if (!serverSnap.exists()) {
      throw new Error("Server not found");
    }

    const serverData = serverSnap.data();
    if (serverData.owner_id !== user.uid) {
      throw new Error("Unauthorized");
    }

    // Update server
    await updateDoc(serverRef, updateData);

    // Update tags if provided
    if (updateData.tags) {
      // Delete existing tags
      const tagsQuery = query(
        collection(db, "server_tags"),
        where("server_id", "==", serverId),
      );
      const tagsSnapshot = await getDocs(tagsQuery);

      for (const tagDoc of tagsSnapshot.docs) {
        await deleteDoc(doc(db, "server_tags", tagDoc.id));
      }

      // Add new tags
      const tagsRef = collection(db, "server_tags");
      for (const tag of updateData.tags) {
        await addDoc(tagsRef, {
          server_id: serverId,
          tag,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating server:", error);
    throw error;
  }
};

export const deleteServer = async (serverId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // Verify ownership
    const serverRef = doc(db, "servers", serverId);
    const serverSnap = await getDoc(serverRef);

    if (!serverSnap.exists()) {
      throw new Error("Server not found");
    }

    const serverData = serverSnap.data();
    if (serverData.owner_id !== user.uid) {
      throw new Error("Unauthorized");
    }

    // Delete tags first
    const tagsQuery = query(
      collection(db, "server_tags"),
      where("server_id", "==", serverId),
    );
    const tagsSnapshot = await getDocs(tagsQuery);

    for (const tagDoc of tagsSnapshot.docs) {
      await deleteDoc(doc(db, "server_tags", tagDoc.id));
    }

    // Delete server
    await deleteDoc(serverRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting server:", error);
    throw error;
  }
};

export const bumpServer = async (serverId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // Verify ownership
    const serverRef = doc(db, "servers", serverId);
    const serverSnap = await getDoc(serverRef);

    if (!serverSnap.exists()) {
      throw new Error("Server not found");
    }

    const serverData = serverSnap.data();
    if (serverData.owner_id !== user.uid) {
      throw new Error("Unauthorized");
    }

    // Check if enough time has passed since last bump
    const lastBumped = serverData.last_bumped?.toDate() || new Date(0);
    const now = new Date();
    const hoursSinceLastBump =
      (now.getTime() - lastBumped.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastBump < 2) {
      throw new Error(
        `Can bump again in ${Math.ceil(2 - hoursSinceLastBump)} hours`,
      );
    }

    // Update last_bumped
    await updateDoc(serverRef, {
      last_bumped: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error bumping server:", error);
    throw error;
  }
};

export { auth, db };
