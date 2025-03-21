// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import {
  FiBook,
  FiFileText,
  FiFolder,
  FiTag,
  FiSearch,
  FiLink,
} from "react-icons/fi";
import { useState, useEffect, memo } from "react";
import { useTheme } from "../../hooks/useTheme";

const Loading = memo(function () {
  const { isDark } = useTheme();
  const [activeIcon, setActiveIcon] = useState(0);
  const icons = [
    { icon: FiBook, label: "Knowledge Base" },
    { icon: FiFileText, label: "Notes" },
    { icon: FiFolder, label: "Organization" },
    { icon: FiTag, label: "Tags" },
    { icon: FiSearch, label: "Search" },
    { icon: FiLink, label: "Connections" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        !isDark ? "bg-gray-50" : "bg-[#00170C]"
      }`}
    >
      <div className="text-center">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            {icons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: activeIcon === index ? 1 : 0,
                    opacity: activeIcon === index ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Icon
                    className={`${
                      !isDark ? "text-green-500" : "text-amber-100"
                    }`}
                    size={64}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.h2
          className={`text-xl font-semibold mb-2 ${
            !isDark ? "text-gray-800" : "text-amber-100"
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {icons[activeIcon].label}
        </motion.h2>

        <motion.p
          className={`max-w-md mx-auto ${
            !isDark ? "text-gray-600" : "text-amber-50"
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading your knowledge workspace...
        </motion.p>

        <motion.div
          className="mt-8 flex space-x-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className={`w-3 h-3 rounded-full ${
                !isDark ? "bg-green-500" : "bg-amber-100"
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
});

export default Loading;
