/**
 * @file Authentication store and hook
 *
 * This file provides authentication state management using Zustand
 * combined with React Query for efficient data fetching and caching.
 *
 * @example
 * // Using the auth hook in a login component
 * import { useAuth } from '../stores/useAuthStore';
 *
 * function LoginForm() {
 *   const { signIn, isLoading, error } = useAuth();
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     try {
 *       await signIn({ email, password });
 *       // Redirect on success
 *     } catch (err) {
 *       console.error('Login failed:', err);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <div className="error">{error.message}</div>}
 *       <input
 *         type="email"
 *         value={email}
 *         onChange={(e) => setEmail(e.target.value)}
 *       />
 *       <input
 *         type="password"
 *         value={password}
 *         onChange={(e) => setPassword(e.target.value)}
 *       />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? 'Logging in...' : 'Login'}
 *       </button>
 *     </form>
 *   );
 * }
 *
 * @example
 * // Using the auth hook for protected routes
 * import { useAuth } from '../stores/useAuthStore';
 *
 * function ProtectedRoute({ children }) {
 *   const { isAuthenticated, isLoading } = useAuth();
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return children;
 * }
 */

import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Base Zustand store for authentication state
 *
 * @typedef {Object} AuthState
 * @property {Object|null} user - Current authenticated user
 * @property {Object|null} profile - User profile data
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} initialize - Initialize auth state and listeners
 * @property {function} fetchProfile - Fetch user profile
 * @property {function} signIn - Sign in with email and password
 * @property {function} signUp - Create a new account
 * @property {function} signOut - Sign out the current user
 * @property {function} isAuthenticated - Check if user is authenticated
 */

// Create the base Zustand store
export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  profile: null,
  isLoading: true,
  error: null,

  // Initialize auth state
  initialize: async () => {
    // Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, isLoading: false });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      set({ user: session?.user ?? null });

      // We'll handle profile fetching with React Query instead
      // by invalidating the query when needed
    });

    // Return unsubscribe function
    return () => {
      subscription?.unsubscribe();
    };
  },

  // Fetch user profile
  fetchProfile: async (userId) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      set({ error });
      console.error("Error fetching profile:", error);
    }
  },

  // Sign in
  signIn: async ({ email, password }) => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  // Sign up
  signUp: async ({ email, password, username }) => {
    set({ isLoading: true, error: null });

    try {
      const {
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin + '/',
        },
      });

      if (error) throw error;
      
      set({ isLoading: false });
      
      window.location.href = '/verify-email';
      
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  google: async () => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  gitHub: async () => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  // Computed values
  isAuthenticated: () => get().user !== null,
}));

// Create a custom hook that combines Zustand with React Query
export function useAuth() {
  const {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    initialize,
    google,
    gitHub,
  } = useAuthStore();
  const queryClient = useQueryClient();

  // Use React Query to fetch and cache the profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        // Try to fetch the profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // If profile exists, return it
        if (data) return data;

        // If no profile exists (and it's not another error), create one
        if (error && error.code === "PGRST116") {

          // Get username from user metadata or email
          const username =
            user.user_metadata?.username || user.email?.split("@")[0];

          // Create a new profile
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                username: username,
                display_name: username,
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          return newProfile;
        }

        // If it's another error, throw it
        if (error) throw error;
      } catch (error) {
        console.error("Profile fetch/create error:", error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Initialize auth on component mount
  useEffect(() => {
    const unsubscribe = initialize();

    // Set up listener for auth state changes to invalidate queries
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
      if (event === "SIGNED_OUT") {
        queryClient.removeQueries({ queryKey: ["profile"] });
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
      subscription?.unsubscribe();
    };
  }, [queryClient, initialize]);

  return {
    user,
    profile,
    isLoading: isLoading || profileLoading,
    error,
    signIn,
    signUp,
    signOut,
    google,
    gitHub,
    isAuthenticated: isAuthenticated(),
    refreshProfile: () =>
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] }),
  };
}
