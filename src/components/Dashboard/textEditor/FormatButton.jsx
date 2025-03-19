import { useTheme } from "../../../hooks/useTheme";
import { forwardRef } from "react";

export const FormatButton = forwardRef(function FormatButton(props, ref) {
  const { theme } = useTheme();

  const {
    onClick,
    isActive,
    icon: Icon,
    tooltip,
    className,
    disabled = false,
    size = 18,
    ...otherProps
  } = props;

  const isDark = theme !== "light";

  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={ref}
      onMouseDown={handleClick}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={tooltip}
      title={tooltip}
      className={`p-2 rounded-md transition-colors cursor-pointer ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isActive
          ? isDark
            ? "bg-amber-700 text-amber-100"
            : "bg-gray-200 text-gray-900"
          : isDark
          ? "text-amber-100 hover:bg-amber-900/50"
          : "hover:bg-gray-100"
      } ${className || ""}`}
      type="button"
      {...otherProps}
    >
      {Icon && <Icon size={size} />}
      {props.children}
    </button>
  );
});
