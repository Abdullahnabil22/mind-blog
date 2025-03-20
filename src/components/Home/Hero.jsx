// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaRocket, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaBrain } from "react-icons/fa6";
import { useSettingsStore } from "../../stores";
import { PiMouseScrollBold } from "react-icons/pi";


export function Hero() {
  const { theme } = useSettingsStore();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="relative  max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <header className="flex justify-center items-center mb-6">
            <FaBrain size={50} className="text-green-500 mr-3" />
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-extrabold ${
                theme === "light" ? "text-black" : "text-amber-100"
              }`}
            >
              Mind <span className="text-green-500">Blog</span>
            </h1>
          </header>

          <p
            className={`text-xl md:text-2xl max-w-3xl mx-auto mb-10 ${
              theme === "light" ? "text-gray-700" : "text-amber-50"
            }`}
          >
            Your personal knowledge workspace. Capture ideas, share insights,
            and organize your thoughts in one place.
          </p>

          <section className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <motion.a
              href="/workspace"
              className={`px-8 py-4 cursor-pointer text-lg font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
                theme === "light"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-[#00170C]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket className="text-xl" />
              Get Started
            </motion.a>

            <motion.button
              className={`px-8 py-4 text-lg cursor-pointer font-medium rounded-md border-2 flex items-center justify-center gap-2 transition-all ${
                theme === "light"
                  ? "border-green-500 text-black hover:bg-green-50"
                  : "border-amber-100 text-amber-100 hover:bg-[#00170C]/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </section>

          <footer className="flex justify-center space-x-6 mb-12">
            {[
              { icon: FaGithub, link: "https://github.com/Abdullahnabil22" },
              {
                icon: FaLinkedin,
                link: "https://www.linkedin.com/in/abdullah-nabil22",
              },
            ].map((Icon, index) => (
              <motion.a
                key={index}
                href={Icon.link}
                className={`${
                  theme === "light"
                    ? "text-gray-700 hover:text-green-500"
                    : "text-amber-100 hover:text-green-500"
                } transition-colors`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon.icon className="text-3xl" />
              </motion.a>
            ))}
          </footer>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <PiMouseScrollBold
            className={`text-3xl ${
              theme === "light" ? "text-gray-700" : "text-amber-100"
            }`}
          />
        </motion.div>
      </div>
    </section>
  );
}
