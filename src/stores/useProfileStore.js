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
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) return data;
        if (error && error.code === "PGRST116") {
          const username =
            user.user_metadata?.username || user.email?.split("@")[0];
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
        if (error) throw error;
      } catch (error) {
        console.error("Profile fetch/create error:", error);
        throw error;
      }
    },
    enabled: !!user,
    ...sessionQueryConfig(),
  });
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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