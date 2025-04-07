/**
 * @file Authentication store and hook
 *
 * This file provides authentication state management using Zustand.
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
const useAuthStore = create((set, get) => ({
  // State
  user: null,
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
    });

    // Return unsubscribe function
    return () => {
      subscription?.unsubscribe();
    };
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin + "/",
        },
      });

      if (error) throw error;

      set({ isLoading: false });
      window.location.href = "/verify-email";
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  // Google sign in
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

// Create a custom hook that combines Zustand with auth state
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
  } = useAuthStore();

  // Initialize auth on component mount
  useEffect(() => {
    const unsubscribe = initialize();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [initialize]);

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    google,
    isAuthenticated: isAuthenticated(),
  };
}
