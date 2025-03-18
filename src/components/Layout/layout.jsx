import { Outlet } from "react-router";
import { NavBar } from "../reusable/nav";
import { useSettingsStore } from "../../stores";
import { ThemeAnimation } from "../reusable/themeAnimation";

export function Layout() {
  const { theme } = useSettingsStore();

  return (
    <div className="relative min-h-screen">
      <ThemeAnimation />

      <div
        className={`relative z-10 min-h-screen ${
          theme === "light" ? "text-black" : "text-amber-100"
        }`}
      >
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
}
