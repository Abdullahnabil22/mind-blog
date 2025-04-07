import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { sessionQueryConfig } from "../lib/queryConfig";
import { useEffect } from "react";

export function useProfile(user) {
  const queryClient = useQueryClient();

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
    ...sessionQueryConfig(),
  });

  // Set up React Query cache invalidation on auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only invalidate if the user ID actually changed
      const currentUserId = user?.id;
      const newUserId = session?.user?.id;

      if (event === "SIGNED_IN" && currentUserId !== newUserId) {
        queryClient.invalidateQueries({
          queryKey: ["profile", newUserId],
          exact: true,
        });
      }
      if (event === "SIGNED_OUT") {
        queryClient.removeQueries({
          queryKey: ["profile"],
          exact: false,
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient, user?.id]);

  return {
    profile,
    isLoading: profileLoading,
    refreshProfile: () =>
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id],
        exact: true,
      }),
  };
} 