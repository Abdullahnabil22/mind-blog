import { useRef } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { useClickOutside } from "../../../hooks/useClickOutside";

export const OptionsMenu = ({ isOpen, onClose, children, className = "" }) => {
  const { isDark } = useTheme();
  const menuRef = useRef(null);

  useClickOutside(menuRef, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 right-0 top-8 w-36 rounded-md shadow-lg py-1 ${
        isDark
          ? "bg-gray-900 text-amber-100 border border-gray-800"
          : "bg-white border border-gray-200"
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};
