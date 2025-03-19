import { FaBrain } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSettingsStore } from "../../../stores";
import { ThemeToggler } from "../theme";
import { SignOut } from "../signOutButton";
import { useAuth } from "../../../stores/useAuthStore";
import { Link, NavLink } from "react-router";

export function NavBar() {
  const { theme } = useSettingsStore();
  const { profile, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 px-8 z-20 relative">
        <div className="flex items-center gap-2">
          <FaBrain size={20} className="text-green-400" />
          <Link to="/" className="text-xl font-bold">
            Mind <strong className="text-green-400">Blog</strong>
          </Link>
        </div>

        {isAuthenticated && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <NavLink
                className={({ isActive }) =>
                  `${
                    theme === "light"
                      ? "text-black bg-transparent hover:bg-black hover:text-white "
                      : " text-amber-100 bg-transparent hover:bg-amber-100 hover:text-[#00170C] "
                  } ${
                    isActive ? " text-green-500 font-bold" : "font-semibold"
                  } cursor-pointer me-2 py-2 px-4 rounded-md text-sm `
                }
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${
                    theme === "light"
                      ? "text-black bg-transparent hover:bg-black hover:text-white "
                      : " text-amber-100 bg-transparent hover:bg-amber-100 hover:text-[#00170C] "
                  } ${
                    isActive ? " text-green-500 font-bold" : "font-semibold"
                  } cursor-pointer me-2 py-2 px-4 rounded-md text-sm `
                }
                to="/workspace"
              >
                Workspace
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${
                    theme === "light"
                      ? "text-black bg-transparent hover:bg-black hover:text-white "
                      : " text-amber-100 bg-transparent hover:bg-amber-100 hover:text-[#00170C] "
                  } ${
                    isActive ? " text-green-500 font-bold" : "font-semibold"
                  } cursor-pointer me-2 py-2 px-4 rounded-md text-sm `
                }
                to="/profile"
              >
                Profile
              </NavLink>

              <SignOut />
              <ThemeToggler />
              <div className="flex items-center ms-3">
                {profile?.avatar_url ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={profile?.avatar_url}
                    alt="avatar"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center text-amber-100 font-bold ">
                    {profile?.display_name.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <p className="ml-2 font-semibold self-center">
                  {profile?.display_name}
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center z-50">
              <motion.button
                onClick={toggleMenu}
                className={`focus:outline-none p-2 rounded-full cursor-pointer  ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-800"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <HiMenuAlt3
                  className={`w-6 h-6 ${
                    theme === "light" ? "text-black" : "text-amber-100"
                  } z-50`}
                />
              </motion.button>
            </div>
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isAuthenticated && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              className={`fixed top-0 right-0 h-full w-3/4 max-w-xs ${
                theme === "light" ? "bg-white" : "bg-[#001A0E]"
              } shadow-xl z-50`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* User profile section at top */}
                <div
                  className={`p-6 ${
                    theme === "light" ? "bg-gray-50" : "bg-[#002813]"
                  } border-b ${
                    theme === "light" ? "border-gray-200" : "border-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {profile?.avatar_url ? (
                      <img
                        className="w-12 h-12 rounded-full border-2 border-green-500"
                        src={profile?.avatar_url}
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center text-amber-100 font-bold text-xl">
                        {profile?.display_name.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <p
                        className={`font-bold ${
                          theme === "light" ? "text-gray-800" : "text-amber-100"
                        }`}
                      >
                        {profile?.display_name}
                      </p>
                      <p className="text-xs text-green-500 font-medium">
                        Logged in
                      </p>
                    </div>
                    <motion.button
                      onClick={toggleMenu}
                      className={`focus:outline-none p-2 ms-6 self-end rounded-full cursor-pointer  ${
                        theme === "light"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-800"
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HiX
                        className={`w-6 h-6 ${
                          theme === "light" ? "text-black" : "text-amber-100"
                        } z-50`}
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Menu items */}
                <motion.div
                  className="flex-1 overflow-y-auto py-6 px-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="mb-8">
                    <NavLink
                      className={({ isActive }) =>
                        `block w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                          theme === "light"
                            ? isActive
                              ? "bg-green-100 text-green-700 font-bold"
                              : "hover:bg-gray-100 text-gray-800"
                            : isActive
                            ? "bg-green-900 bg-opacity-30 text-green-400 font-bold"
                            : "hover:bg-gray-800 text-amber-100"
                        } mb-2`
                      }
                      to="/"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        <span className="text-base">Home</span>
                      </div>
                    </NavLink>

                    <NavLink
                      className={({ isActive }) =>
                        `block w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                          theme === "light"
                            ? isActive
                              ? "bg-green-100 text-green-700 font-bold"
                              : "hover:bg-gray-100 text-gray-800"
                            : isActive
                            ? "bg-green-900 bg-opacity-30 text-green-400 font-bold"
                            : "hover:bg-gray-800 text-amber-100"
                        }`
                      }
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        <span className="text-base">Profile</span>
                      </div>
                    </NavLink>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <p
                      className={`px-4 text-xs uppercase font-semibold mb-2 ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Settings
                    </p>
                    <div
                      className={`p-4 rounded-lg ${
                        theme === "light"
                          ? "bg-gray-50"
                          : "bg-gray-900 bg-opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`${
                            theme === "light"
                              ? "text-gray-700"
                              : "text-amber-100"
                          }`}
                        >
                          Theme
                        </span>
                        <ThemeToggler />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Sign out at bottom */}
                <motion.div
                  variants={itemVariants}
                  className={`p-4 border-t ${
                    theme === "light" ? "border-gray-200" : "border-gray-800"
                  }`}
                >
                  <div className="px-2">
                    <SignOut className="w-full" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
