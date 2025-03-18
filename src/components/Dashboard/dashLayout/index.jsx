import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../reusable/appSidebar";
import { useSettingsStore } from "../../../stores";
export function DashLayout() {
  const { theme } = useSettingsStore();
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main
          className={`w-screen pl-2${
            theme === "light"
              ? "text-black bg-white"
              : "text-amber-100 bg-[#00170C]"
          }`}
        >
          <SidebarTrigger
            className={`cursor-pointer m-2 ${
              theme === "light"
                ? "text-black"
                : "text-amber-100 hover:bg-amber-100"
            } `}
          />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
