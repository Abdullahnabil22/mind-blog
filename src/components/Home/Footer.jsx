import { useTheme } from "../../hooks/useTheme";

export function MainFooter() {
  const { isDark } = useTheme();
  return (
    <footer className="flex justify-center border-t p-6">
      <p
        className={`text-sm ${
          isDark
            ? "text-amber-100 border-gray-800"
            : "text-gray-500 border-gray-200"
        }`}
      >
        © {new Date().getFullYear()} Mind{" "}
        <span className="text-green-500 font-bold">Blog</span> - Your personal
        knowledge workspace made by Abdullah Nabil.
      </p>
    </footer>
  );
}
