import { useState, useEffect } from "react";
import { useAuth } from "../../stores/useAuthStore";
import { useSettingsStore } from "../../stores";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Activity } from "./activity";
import { Avatar } from "../reusable/avatar";
import { ProfileInfo } from "./profileInfo";

export function Profile() {
  const { profile } = useAuth();
  const { theme } = useSettingsStore();

  const [profileData, setProfileData] = useState({
    username: "",
    display_name: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        avatar: profile.avatar_url || "",
      });
    }
  }, [profile]);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <main className="max-w-6xl mx-auto ">
          <header className="pb-0">
            <p
              className={`text-3xl font-bold text-center ${
                theme === "dark" ? "text-amber-100" : "text-black"
              }`}
            >
              Your <span className="text-green-500">Profile</span>
            </p>
            <p
              className={`text-center text-sm ${
                theme === "dark" ? "text-amber-50" : "text-gray-500"
              }`}
            >
              Manage your personal information and preferences
            </p>
          </header>

          <section className="p-6">
            <Tabs defaultValue="profile" className="w-full ">
              <TabsList
                className={`grid w-full grid-cols-2 mb-8 ${
                  theme === "light" ? "bg-[#eaeaea]" : "bg-amber-100"
                }`}
              >
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <section className="flex flex-col md:flex-row gap-8 items-center md:items-start ">
                  {/* Avatar Section */}
                  <Avatar
                    setProfileData={setProfileData}
                    profileData={profileData}
                  />
                  {/* Profile Info Section */}
                  <ProfileInfo
                    profileData={profileData}
                    setProfileData={setProfileData}
                  />
                </section>
              </TabsContent>

              <TabsContent value="activity">
                <Activity />
              </TabsContent>
            </Tabs>
          </section>

          <footer className="flex justify-center border-t pt-6">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-amber-100" : "text-gray-500"
              }`}
            >
              Mind <span className="text-green-500 font-bold">Blog</span> - Your
              personal knowledge workspace
            </p>
          </footer>
        </main>
      </motion.div>
    </div>
  );
}

export default Profile;
