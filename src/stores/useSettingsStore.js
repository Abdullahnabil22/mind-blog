import { create } from "zustand";
import { persist } from "zustand/middleware";
/**
 * Settings store for user preferences
 *
 * @typedef {Object} SettingsState
 * @property {string} theme - Current theme ('light' or 'dark')
 * @property {function} setTheme - Function to update the theme
 *
 * @example
 * // Using the settings store in a component
 * import { useSettingsStore } from '../stores';
 *
 * function ThemeToggle() {
 *   const { theme, setTheme } = useSettingsStore();
 *
 *   const toggleTheme = () => {
 *     setTheme(theme === 'light' ? 'dark' : 'light');
 *   };
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 */

/**
 * Hook to access the settings store
 * Uses Zustand's persist middleware to save settings in localStorage
 *
 * @returns {SettingsState} The settings state and actions
 */
export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings-storage",
      getStorage: () => localStorage,
    }
  )
);
