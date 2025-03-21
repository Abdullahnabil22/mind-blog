import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../stores/useAuthStore";
import { Loader2, Camera, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../../hooks/useTheme";

export function Avatar({ setProfileData, profileData }) {
  const { isDark } = useTheme();
  const { profile, refreshProfile } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e) => {
    try {
      setUploadingAvatar(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 2) {
        throw new Error("File size must be less than 2MB");
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to upload an avatar");
      }

      // Upload directly to the avatars bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update profile with new avatar URL - using avatar_url column name
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      // Update local state - still using avatar for component state
      setProfileData({ ...profileData, avatar: data.publicUrl });
      refreshProfile();
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(
        "Error uploading avatar: " + (error.message || "Unknown error")
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadingAvatar(true);

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      // Update local state
      setProfileData({ ...profileData, avatar: null });
      refreshProfile();
      toast.success("Avatar removed successfully!");
    } catch (error) {
      console.error("Avatar removal error:", error);
      toast.error(
        "Error removing avatar: " + (error.message || "Unknown error")
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div
            className={`w-40 h-40 rounded-full overflow-hidden border-4 shadow-lg ${
              !isDark ? "border-green-400" : "border-amber-100"
            }`}
          >
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-200 text-green-800 text-4xl font-bold">
                {profileData.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 right-0">
            <div className="relative group">
              <label
                className={`p-3 rounded-full cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center ${
                  !isDark
                    ? "bg-green-500 hover:bg-green-600 text-amber-100"
                    : "bg-amber-100 hover:bg-amber-200 text-[#00170C]"
                }`}
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>

              {profileData.avatar && (
                <button
                  className={`absolute right-0 bottom-12 p-3 rounded-full cursor-pointer shadow-lg transition-all duration-300 
                    opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 origin-bottom flex items-center justify-center ${
                      !isDark
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-red-400 hover:bg-red-500 text-white"
                    }`}
                  onClick={handleRemoveAvatar}
                  disabled={uploadingAvatar}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3
            className={`text-xl font-bold ${
              !isDark ? "text-black" : "text-amber-100"
            }`}
          >
            {profile?.display_name || profile?.username}
          </h3>
          <p
            className={`text-sm ${!isDark ? "text-gray-500" : "text-amber-50"}`}
          >
            Member since {new Date(profile?.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}
