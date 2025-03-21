import { useTheme } from "../../../hooks/useTheme";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
export function ThemeAnimation() {
  const { isDark, theme } = useTheme();
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={theme}
          className={`absolute inset-0 z-0 ${
            !isDark ? "bg-green-50" : "bg-[#00170C]"
          }`}
          initial={{ clipPath: "circle(0% at top right)" }}
          animate={{ clipPath: "circle(150% at top right)" }}
          exit={{ clipPath: "circle(0% at top right)" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </AnimatePresence>
    </>
  );
}
