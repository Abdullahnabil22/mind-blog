import { useTheme } from "../../../hooks/useTheme";
import { forwardRef } from "react";

export const FormatButton = forwardRef(function FormatButton(props, ref) {
  const { isDark } = useTheme();

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

  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative">
      {isActive && (
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 rounded-full ${
            isDark ? "bg-amber-500" : "bg-green-500"
          }`}
        />
      )}
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
              ? "bg-amber-700/50 text-amber-100 pl-3"
              : "bg-gray-200/80 text-gray-900 pl-3"
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
    </div>
  );
});
