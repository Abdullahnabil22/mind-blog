// eslint-disable-next-line
import { motion, useAnimation } from "framer-motion";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

const Particles = () => {
  const { isDark } = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            isDark ? "bg-primary/30" : "bg-primary/10"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, isDark ? 0.7 : 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const NotFoundIllustration = () => {
  const { isDark } = useTheme();
  const controls = useAnimation();

  useEffect(() => {
    // Start the floating animation
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  return (
    <motion.div animate={controls}>
      <svg
        className="w-full h-52 mb-6"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Page shape */}
          <motion.rect
            x="100"
            y="20"
            width="200"
            height="160"
            rx="8"
            fill={isDark ? "white" : "currentColor"}
            fillOpacity={isDark ? "0.2" : "0.1"}
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Broken corner */}
          <motion.path
            d="M300 20 L270 50 L300 80"
            stroke="currentColor"
            strokeWidth="2"
            fill={isDark ? "white" : "currentColor"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />

          {/* Content lines */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <rect
              x="120"
              y="70"
              width="160"
              height="10"
              rx="2"
              fill={isDark ? "white" : "currentColor"}
              fillOpacity={isDark ? "0.4" : "0.3"}
            />
            <rect
              x="120"
              y="90"
              width="120"
              height="10"
              rx="2"
              fill={isDark ? "white" : "currentColor"}
              fillOpacity={isDark ? "0.4" : "0.3"}
            />
            <rect
              x="120"
              y="110"
              width="140"
              height="10"
              rx="2"
              fill={isDark ? "white" : "currentColor"}
              fillOpacity={isDark ? "0.4" : "0.3"}
            />
            <rect
              x="120"
              y="130"
              width="90"
              height="10"
              rx="2"
              fill={isDark ? "white" : "currentColor"}
              fillOpacity={isDark ? "0.4" : "0.3"}
            />
          </motion.g>

          {/* 404 Text */}
          <motion.text
            x="200"
            y="150"
            fontSize="48"
            fontWeight="bold"
            fill={isDark ? "white" : "currentColor"}
            textAnchor="middle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            404
          </motion.text>
        </motion.g>
      </svg>
    </motion.div>
  );
};

export function NotFound() {
  const { isDark } = useTheme();

  return (
    <div
      className={` flex flex-col items-center justify-center  text-foreground p-4 relative overflow-hidden `}
    >
      <Particles />

      <motion.div
        className="text-center max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NotFoundIllustration />

        <motion.h1
          className={`text-6xl md:text-8xl font-bold mb-4 ${
            isDark ? "text-amber-100" : "text-primary"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.h2
          className={`text-2xl md:text-3xl font-semibold mb-6 ${
            isDark ? "text-amber-50" : "text-primary"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          className={`text-muted-foreground mb-8 text-lg ${
            isDark ? "text-amber-50" : "text-primary"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          The page you are looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <Link to="/">
            <motion.button
              className={`flex items-center justify-center gap-2 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer ${
                isDark
                  ? "shadow-lg shadow-primary/20 bg-green-500"
                  : "bg-primary "
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHome className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>

          <Link to="#" onClick={() => window.history.back()}>
            <motion.button
              className={`flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer ${
                isDark ? "shadow-lg shadow-secondary/20" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
