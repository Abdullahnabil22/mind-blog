import { useTheme } from "../../hooks/useTheme";

export function Activity() {
  const { isDark } = useTheme();
  return (
    <>
      <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3
          className={`text-xl font-bold mb-2 ${
            !isDark ? "text-black" : "text-amber-100"
          }`}
        >
          Activity Coming Soon
        </h3>
        <p
          className={`max-w-md ${!isDark ? "text-gray-400" : "text-amber-100"}`}
        >
          We're working on tracking your notes, comments, and interactions.
          Check back soon to see your activity history!
        </p>
      </div>
    </>
  );
}
