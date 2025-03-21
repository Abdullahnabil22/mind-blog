import { useTheme } from "../../hooks/useTheme";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  const { isDark } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-6xl mb-12 mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4 md:text-4xl tracking-tight">
            Start with a single note
          </h2>
          <p
            className={`text-lg ${isDark ? "text-amber-50" : "text-gray-600"}`}
          >
            Your second brain begins with a single thought. From there, watch as
            your knowledge network grows organically.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={`rounded-xl overflow-hidden shadow-2xl border mx-4 ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`h-8 border-b flex items-center px-4 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex space-x-2"
            >
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </motion.div>
          </div>
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            src={isDark ? "MindDark.png" : "MindBlog.png"}
            alt="Mind Blog workspace interface showing document editor"
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
