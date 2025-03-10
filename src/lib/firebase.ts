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
  listeners: [],
  onAuthStateChanged: (callback) => {
    mockAuth.listeners.push(callback);
    callback(mockAuth.currentUser);
    return () => {
      mockAuth.listeners = mockAuth.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  },
  signInWithPopup: async () => {
    const mockUser = {
      uid: "mock-user-id",
      email: "discord-user@example.com",
      displayName: "Discord User",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=discord",
      providerData: [
        {
          uid: "123456789012345678",
          providerId: "discord.com",
        },
      ],
    };
    mockAuth.currentUser = mockUser;
    mockAuth.listeners.forEach((listener) => listener(mockUser));
    return { user: mockUser };
  },
  signOut: async () => {
    mockAuth.currentUser = null;
    mockAuth.listeners.forEach((listener) => listener(null));
    return Promise.resolve();
  },
};

// Mock database with some sample data
let mockServers = [
  {
    id: "server-1",
    name: "Gaming Haven",
    description:
      "A vibrant community for gamers of all levels. Join us for daily events, tournaments, and friendly matches!",
    banner_url:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    invite_url: "https://discord.gg/gaming",
    member_count: 5000,
    owner_id: "mock-user-id",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    last_bumped: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "server-2",
    name: "Tech Enthusiasts",
    description:
      "Discuss the latest in technology, share tips, and get help with your tech problems.",
    banner_url:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80",
    invite_url: "https://discord.gg/tech",
    member_count: 3500,
    owner_id: "mock-user-id",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    last_bumped: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

let mockTags = [
  { id: "tag-1", server_id: "server-1", tag: "Gaming" },
  { id: "tag-2", server_id: "server-1", tag: "Esports" },
  { id: "tag-3", server_id: "server-1", tag: "Community" },
  { id: "tag-4", server_id: "server-2", tag: "Technology" },
  { id: "tag-5", server_id: "server-2", tag: "Programming" },
  { id: "tag-6", server_id: "server-2", tag: "Gadgets" },
];

const mockDb = {
  collection: (collectionName) => {
    return {
      docs:
        collectionName === "servers"
          ? mockServers
          : collectionName === "server_tags"
            ? mockTags
            : [],
      get: async () => ({
        docs:
          collectionName === "servers"
            ? mockServers.map((server) => ({
                id: server.id,
                data: () => server,
                exists: () => true,
              }))
            : collectionName === "server_tags"
              ? mockTags.map((tag) => ({
                  id: tag.id,
                  data: () => tag,
                  exists: () => true,
                }))
              : [],
      }),
    };
  },
  doc: (_, __, id) => ({
    get: async () => {
      const server = mockServers.find((s) => s.id === id);
      return {
        exists: () => !!server,
        data: () => server || {},
      };
    },
  }),
  addDoc: async (collection, data) => {
    const id = `mock-${Date.now()}`;
    if (collection.docs === mockServers) {
      mockServers.push({ id, ...data });
    } else if (collection.docs === mockTags) {
      mockTags.push({ id, ...data });
    }
    return { id };
  },
  getDoc: async (docRef) => {
    // This is simplified, in a real implementation we would use the docRef to find the document
    return { exists: () => true, data: () => ({}) };
  },
  getDocs: async (query) => {
    // This is simplified, in a real implementation we would filter based on the query
    return {
      docs: mockServers.map((server) => ({
        id: server.id,
        data: () => server,
        exists: () => true,
      })),
    };
  },
  updateDoc: async (docRef, data) => {
    // This is simplified, in a real implementation we would update the document
    return {};
  },
  deleteDoc: async (docRef) => {
    // This is simplified, in a real implementation we would delete the document
    return {};
  },
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({}),
  serverTimestamp: () => new Date(),
};

// Initialize Firebase with error handling
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Fall back to mock implementations
  auth = mockAuth;
  db = mockDb;
  console.log("Using mock Firebase implementation");
}

// Discord OAuth provider
const discordProvider = new OAuthProvider("discord.com");
discordProvider.setCustomParameters({
  prompt: "consent",
});
discordProvider.addScope("identify");
discordProvider.addScope("email");
discordProvider.addScope("guilds");

// Auth functions
export const signInWithDiscord = async () => {
  try {
    await signOut(auth); // Clear any existing session first

    // Use real Firebase auth with Discord provider
    const result = await signInWithPopup(auth, discordProvider);
    console.log("Discord sign in successful:", result);
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

    // Filter servers based on options
    let filteredServers = [...mockServers];

    if (ownerId) {
      filteredServers = filteredServers.filter(
        (server) => server.owner_id === ownerId,
      );
    }

    // Sort servers
    filteredServers.sort((a, b) => {
      if (orderDirection === "desc") {
        return new Date(b[orderByField]) - new Date(a[orderByField]);
      } else {
        return new Date(a[orderByField]) - new Date(b[orderByField]);
      }
    });

    // Add tags to each server
    return filteredServers.map((server) => {
      const serverTags = mockTags.filter((tag) => tag.server_id === server.id);
      return {
        ...server,
        server_tags: serverTags,
      };
    });
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
