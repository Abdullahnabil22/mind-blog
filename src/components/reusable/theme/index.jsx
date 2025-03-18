import { MdLightMode, MdNightsStay } from "react-icons/md";
import { useTheme } from "../../../hooks/useTheme";
export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="cursor-pointer ml-2 p-1 rounded-full group"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <MdLightMode
          size={28}
          className="text-black group-hover:text-green-500"
        />
      ) : (
        <MdNightsStay
          size={28}
          className="text-amber-100 group-hover:text-green-500"
        />
      )}
    </button>
  );
}
