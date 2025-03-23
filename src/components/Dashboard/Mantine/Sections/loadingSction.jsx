import { useTheme } from "../../../../hooks/useTheme";

export function LoadingSection() {
  const { isDark } = useTheme();
  return (
    <>
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className="border-4 border-gray-200 border-t-green-500 h-8 rounded-full w-8 animate-spin"></div>
        <div
          className={`text-sm ${
            isDark ? "text-amber-200/70" : "text-gray-500"
          }`}
        >
          Loading note data...
        </div>
      </div>
    </>
  );
}
