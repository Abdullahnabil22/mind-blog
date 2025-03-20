import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/button";
import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";

export function Explore() {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <section ref={ref} className="container mx-auto px-8 py-4">
        <div className="grid gap-8 items-center md:grid-cols-2">
          <motion.div 
            className="order-2 md:order-1"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold lg:text-6xl mb-4 md:text-5xl tracking-tight"
            >
              Your mind, <span className="text-green-500">organized</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className={`mb-6 text-lg md:pr-12 ${isDark ? "text-amber-50" : "text-gray-700"}`}
            >
              Mind blog helps you organize your thoughts, ideas, and knowledge
              in a beautiful, interconnected workspace that grows with your
              thinking.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button className="bg-green-500 rounded-lg text-white cursor-pointer hover:bg-green-800">
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="order-1 h-[500px] w-full md:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className={`flex-1 min-h-[450px] p-6 rounded-lg shadow-md w-full hover:shadow-lg transition-all ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div
                className={`h-14 rounded w-full mb-4 ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-8 rounded w-full mb-3 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>
              <div
                className={`h-8 rounded w-full mb-3 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>
              <div
                className={`h-8 rounded w-4/5 mb-3 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>
              <div
                className={`h-8 rounded w-4/5 mb-5 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>
              <div
                className={`h-8 rounded w-2/3 mb-5 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>{" "}
              <div
                className={`h-8 rounded w-2/3 mb-5 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>{" "}
              <div
                className={`h-8 rounded w-2/3 mb-5 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              ></div>
              <div className="flex gap-3">
                <div
                  className={`h-7 rounded-md shadow-sm w-20 ${
                    isDark
                      ? "bg-green-900 border border-green-800"
                      : "bg-green-100"
                  }`}
                ></div>
                <div
                  className={`h-7 rounded-md shadow-sm w-20 ${
                    isDark
                      ? "bg-blue-900 border border-blue-800"
                      : "bg-blue-100"
                  }`}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
