import { useSettingsStore } from "../../../stores";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
export function ThemeAnimation() {
  const { theme } = useSettingsStore();
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={theme}
          className={`absolute inset-0 z-0 ${
            theme === "light" ? "bg-green-50" : "bg-[#00170C]"
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
