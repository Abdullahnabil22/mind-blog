import { useSettingsStore } from "../../../stores";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
export function BackgroundAnimation() {
  const { theme } = useSettingsStore();
  return (
    <div className="absolute inset-0 overflow-hidden z-1">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${
            theme === "light" ? "bg-green-500/70" : "bg-green-400/50"
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            scale: Math.random() * 0.8 + 0.2,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: [0, Math.random() * 100 + 50],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [Math.random() * 0.5 + 0.3, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
