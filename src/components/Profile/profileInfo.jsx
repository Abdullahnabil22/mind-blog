import { useState } from "react";
import { useAuth } from "../../stores/useAuthStore";
import { supabase } from "../../lib/supabase";
import { User, Mail, Edit2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PiUserCircleFill } from "react-icons/pi";
import { useSettingsStore } from "../../stores";
export function ProfileInfo({ profileData, setProfileData }) {
  const { profile, refreshProfile, user } = useAuth();
  const { theme } = useSettingsStore();
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profileData.username,
          display_name: profileData.display_name,
          bio: profileData.bio,
        })
        .eq("id", profile.id);

      if (error) throw error;

      refreshProfile();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };
  return (
    <>
      <div className="flex-1 space-y-6 w-full">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center">
                <User className="mr-2 h-6 w-6 text-green-500" />
                <Input
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  className="flex-1 bg-background text-[#00170C]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <div className="flex items-center">
                <PiUserCircleFill className="mr-2 h-6 w-6 text-green-500" />
                <Input
                  id="display_name"
                  name="display_name"
                  value={profileData.display_name}
                  onChange={handleChange}
                  className="flex-1 bg-background text-[#00170C]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#00170C]"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setProfileData({
                    username: profile.username || "",
                    display_name: profile.display_name || "",
                    bio: profile.bio || "",
                    avatar: profile.avatar_url || ""
                  });
                }}
                className={`cursor-pointer ${
                  theme === "light"
                    ? "text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600"
                    : "text-[#00170C] border-amber-100 bg-amber-100 hover:text-amber-100 hover:bg-[#00170C]"
                }`}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                onClick={handleSaveProfile}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className={`cursor-pointer ${
                  theme === "light"
                    ? "text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600"
                    : "text-[#00170C] border-amber-100 bg-amber-100 hover:text-amber-100 hover:bg-[#00170C]"
                }  `}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p
                    className={`text-sm font-medium  ${
                      theme === "light" ? "text-gray-500" : "text-amber-50"
                    }`}
                  >
                    Username
                  </p>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-black" : "text-amber-100"
                    }`}
                  >
                    {profileData.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pb-2 border-b">
                <PiUserCircleFill className="h-5 w-5 text-green-500" />
                <div>
                  <p
                    className={`text-sm font-medium  ${
                      theme === "light" ? "text-gray-500" : "text-amber-50"
                    }`}
                  >
                    Display Name
                  </p>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-black" : "text-amber-100"
                    }`}
                  >
                    {profileData.display_name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pb-2 border-b">
                <Mail className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p
                    className={`text-sm font-medium  ${
                      theme === "light" ? "text-gray-500" : "text-amber-50"
                    }`}
                  >
                    Email
                  </p>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-black" : "text-amber-100"
                    }`}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p
                  className={`text-sm font-medium  ${
                    theme === "light" ? "text-gray-500" : "text-amber-50"
                  }`}
                >
                  Bio
                </p>
                <p
                  className={`font-medium ${
                    theme === "light" ? "text-black" : "text-amber-100"
                  }`}
                >
                  {profileData.bio ||
                    "No bio provided yet. Click edit to add your bio."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
