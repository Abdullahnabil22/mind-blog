import { useSettingsStore } from "../stores/useSettingsStore";

export function useTheme() {
  const { theme, setTheme } = useSettingsStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const isDark = theme === "dark";
  return { theme, setTheme, toggleTheme, isDark };
}
