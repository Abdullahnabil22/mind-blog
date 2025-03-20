import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/button";

export function Explore() {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  return (
    <>
      <section className="container mx-auto px-8 py-4 ">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your mind, <span className="text-green-500">organized</span>
            </h1>
            <p
              className={`mb-6 text-lg md:pr-12 ${
                isDark ? " text-amber-50" : "text-gray-700"
              }`}
            >
              Mind blog helps you organize your thoughts, ideas, and knowledge
              in a beautiful, interconnected workspace that grows with your
              thinking.
            </p>
            <div>
              <Button className="rounded-lg bg-green-500 text-white hover:bg-green-800 cursor-pointer">
                See how it works
              </Button>
            </div>
          </div>

          <div className="order-1 h-[500px] w-full md:order-2"></div>
        </div>
      </section>
    </>
  );
}
