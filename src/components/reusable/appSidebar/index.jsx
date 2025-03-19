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
  SidebarFooter,
  useSidebar,
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

export function AppSidebar({ ...props }) {
  const { state } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const isDark = theme !== "light";

  return (
    <Sidebar
      className="flex flex-col h-full"
      variant="inset"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader
        className={isDark ? "bg-[#000e07] text-amber-100" : "bg-[#f5f4f4]"}
      >
        {state === "expanded" ? (
          <Link to="/" className="flex justify-center items-center mb-6">
            <FaBrain size={20} className="text-green-500 mr-3" />
            <p
              className={`text-lg md:text-2xl lg:text-2xl font-bold ${
                isDark ? "text-amber-100" : "text-black"
              }`}
            >
              Mind <span className="text-green-500">Blog</span>
            </p>
          </Link>
        ) : (
          <Link to="/">
            <FaBrain
              size={20}
              className={` ${isDark ? "text-amber-100" : "text-green-500"}`}
            />
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent
        className={`${
          isDark ? "bg-[#000e07] text-amber-100" : "bg-[#f5f4f4]"
        } flex-grow overflow-y-auto`}
      >
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
      <SidebarFooter
        className={isDark ? "bg-[#000e07] text-amber-100" : "bg-[#f5f4f4]"}
      >
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`mt-2 ${
                  isDark
                    ? "hover:bg-amber-100 text-amber-100"
                    : "hover:bg-gray-300"
                }`}
              >
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenuButton
          asChild
          className={`cursor-pointer ${
            isDark ? "hover:bg-amber-100 text-amber-100" : "hover:bg-gray-300"
          }`}
        >
          <button onClick={toggleTheme}>
            {isDark ? <FaSun /> : <FaMoon />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </SidebarMenuButton>

        <SidebarMenuButton
          asChild
          className={`mt-2 cursor-pointer p-5 ${
            isDark ? "hover:bg-amber-100 text-amber-100" : "hover:bg-gray-300"
          }`}
        >
          {state === "expanded" ? (
            <div className="flex items-center align-baseline gap-4">
              <div className="flex items-center gap-2">
                {profile?.avatar_url ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={profile?.avatar_url}
                    alt="avatar"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm">
                    {profile?.display_name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div className="flex ">
                  <p className="font-medium text-sm">
                    {profile?.display_name || "User"}
                  </p>
                </div>
              </div>
              <div>
                <SignOut iconVersion={true} />
              </div>
            </div>
          ) : (
            <SignOut iconVersion={true} />
          )}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
