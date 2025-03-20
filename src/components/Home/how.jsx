import { useTheme } from "../../hooks/useTheme";

export default function HowItWorksSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";


  return (
    <section className=" py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mb-12 mx-auto">
          <h2 className="text-3xl  font-bold mb-4 md:text-4xl tracking-tight">
            How Mind blog works
          </h2>
          <p
            className={` text-lg ${isDark ? "text-amber-50" : "text-gray-600"}`}
          >
            A simple process to organize your thoughts and ideas
          </p>
        </div>

        <div
          className={`mx-auto mt-16 max-w-4xl rounded-xl p-8 shadow-sm ${
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900"
              : "bg-gradient-to-br from-blue-50 to-green-50"
          }`}
        >
          <div className="flex flex-col gap-8 items-center md:flex-row">
            <div className="flex-1">
              <h3
                className={` text-2xl font-medium mb-2 ${
                  isDark ? "text-amber-50" : "text-gray-600"
                }`}
              >
                Start with a single note
              </h3>
              <p
                className={`  mb-6 ${
                  isDark ? "text-amber-50" : "text-gray-600"
                }`}
              >
                Your second brain begins with a single thought. From there,
                watch as your knowledge network grows organically.
              </p>
              <div className="bg-green-500 h-1.5 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
