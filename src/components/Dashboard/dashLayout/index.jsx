import { Outlet } from "react-router";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../../reusable/appSidebar";
import { useSettingsStore } from "../../../stores";

export function DashLayout() {
  const { theme } = useSettingsStore();
  const isDark = theme !== "light";

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <SidebarProvider
        style={{
          backgroundColor: isDark ? "#000e07" : "#f5f4f4",
        }}
      >
        <AppSidebar />
        <SidebarInset
          className={`${
            isDark ? "bg-[#00170C] text-amber-100" : "bg-white text-black"
          }`}
        >
          <div className="p-4 h-full">
            <SidebarTrigger
              className={`cursor-pointer mb-4 ${
                isDark
                  ? "text-amber-100 hover:bg-amber-100 hover:text-[#00170C]"
                  : "text-black"
              }`}
            />
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
