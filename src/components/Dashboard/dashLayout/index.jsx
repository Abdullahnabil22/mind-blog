import { Outlet, useParams } from "react-router";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../../reusable/appSidebar";
import { useTheme } from "../../../hooks/useTheme";
import { NotePathBreadcrumb } from "./NoteBreadcrumb";

export function DashLayout() {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const { id } = useParams();

  return (
    <div className="w-full min-h-screen overflow-hidden">
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
          <div className="h-full p-4">
            <div className="flex gap-2 items-center mb-4">
              <SidebarTrigger
                className={`cursor-pointer ${
                  isDark
                    ? "text-amber-100 hover:bg-amber-100 hover:text-[#00170C]"
                    : "text-black"
                }`}
              />
              {id && <NotePathBreadcrumb />}
            </div>
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
