import { Outlet } from "react-router";
import { NavBar } from "../reusable/nav";
import { ThemeAnimation } from "../reusable/themeAnimation";
import { useTheme } from "../../hooks/useTheme";

export function Layout() {
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen">
      <ThemeAnimation />

      <div
        className={`relative z-10 min-h-screen ${
          !isDark ? "text-black" : "text-amber-100"
        }`}
      >
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
}
