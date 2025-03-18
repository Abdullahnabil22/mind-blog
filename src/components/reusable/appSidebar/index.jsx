import { Home } from "lucide-react";
import { LuCircleUserRound as user } from "react-icons/lu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarInput,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { FaBrain, FaMoon, FaSun } from "react-icons/fa6";
import { useAuth } from "../../../stores/useAuthStore";
import { SignOut } from "../signOutButton";
import { useTheme } from "../../../hooks/useTheme";
import {
  Folders,
  FoldersHeader,
} from "../../../components/Dashboard/sideBar/Folders";
import {
  Notes,
  NotesHeader,
} from "../../../components/Dashboard/sideBar/Notes";
import { Link } from "react-router";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: user,
  },
];

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();
  const { profile, user } = useAuth();
  const isDark = theme !== "light";

  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarHeader className={isDark ? "bg-[#000e07] text-amber-100" : ""}>
        <header className="flex justify-center items-center mb-6">
          <FaBrain size={20} className="text-green-500 mr-3" />
          <p
            className={`text-lg md:text-2xl lg:text-2xl font-bold ${
              isDark ? "text-amber-100" : "text-black"
            }`}
          >
            Mind <span className="text-green-500">Blog</span>
          </p>
        </header>
        <SidebarInput placeholder="Search..." />
      </SidebarHeader>
      <SidebarContent
        className={`${
          isDark ? "bg-[#000e07] text-amber-100" : ""
        } flex-grow overflow-y-auto`}
      >
        <SidebarGroup>
          <SidebarGroupLabel className={isDark ? "text-amber-100" : ""}>
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`mt-2 ${
                      isDark ? "hover:bg-amber-100 text-amber-100" : ""
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`mt-2 cursor-pointer ${
                    isDark ? "hover:bg-amber-100 text-amber-100" : ""
                  }`}
                >
                  <button onClick={toggleTheme}>
                    {isDark ? <FaSun /> : <FaMoon />}
                    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspace/Files Section */}
        <SidebarGroup>
          <SidebarGroupLabel
            className={`flex items-center justify-between ${
              isDark ? "text-amber-100" : "text-gray-700"
            }`}
          >
            <span>Workspace</span>
            <div className="flex space-x-1">
              <FoldersHeader />
              <NotesHeader />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1">
              <Folders />
              <Notes parentFolderId={null} />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={isDark ? "bg-[#000e07] text-amber-100" : ""}>
        <div
          className={`flex items-center justify-between w-full p-2 rounded-md ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
          } cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img
                className="w-8 h-8 rounded-full"
                src={profile?.avatar_url}
                alt="avatar"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm">
                {profile?.display_name?.charAt(0).toUpperCase() || "S"}
              </div>
            )}
            <div className="flex flex-col">
              <p className="font-medium text-sm">
                {profile?.display_name || "shadcn"}
              </p>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {user?.email || "m@example.com"}
              </p>
            </div>
          </div>
          <div>
            <SignOut iconVersion={true} />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
