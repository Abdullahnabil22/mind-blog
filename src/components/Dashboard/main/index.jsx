import { useSettingsStore } from "../../../stores";

export function Dashboard() {
  const { theme } = useSettingsStore();
  return (
    <div
      className={`p-4 ${
        theme === "light"
          ? "text-black bg-white"
          : "text-amber-100 bg-[#00170C]"
      }`}
    >
      Dashboard
    </div>
  );
}
