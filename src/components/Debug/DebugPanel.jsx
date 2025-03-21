import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";

export function DebugPanel({
  id,
  options,
  isLoading,
  currentOption,
  editorReady,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { isDark } = useTheme();
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm shadow-md"
      >
        {isExpanded ? "Hide Debug" : "Debug"}
      </button>

      {isExpanded && (
        <div
          className={`mt-2 p-4  rounded-md shadow-lg text-xs text-left w-96 max-h-80 overflow-auto ${
            isDark
              ? "border-amber-900/50 bg-[#001F10] text-amber-100"
              : "bg-white border border-gray-300"
          }`}
        >
          <h3 className="font-bold mb-2">Option Debug Info</h3>
          <p>
            <strong>ID from URL:</strong> {id}
          </p>
          <p>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Options count:</strong> {options?.length || 0}
          </p>
          <p>
            <strong>Editor ready:</strong> {editorReady ? "Yes" : "No"}
          </p>

          <div className="mt-2">
            <h4 className="font-semibold">Current Option:</h4>
            {currentOption ? (
              <div className="ml-2 mt-1">
                <p>
                  <strong>ID:</strong> {currentOption.id}
                </p>
                <p>
                  <strong>Title:</strong> {currentOption.title}
                </p>
                <p>
                  <strong>Folder:</strong>{" "}
                  {currentOption.folder?.name || "None"}
                </p>
                <p>
                  <strong>Has content:</strong>{" "}
                  {currentOption.content ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Has markdown:</strong>{" "}
                  {currentOption.markdown ? "Yes" : "No"}
                </p>
              </div>
            ) : (
              <p className="ml-2 italic">No current note</p>
            )}
          </div>

          <div className="mt-2">
            <h4 className="font-semibold">Available Options:</h4>
            <ul className="ml-2 mt-1">
              {options?.map((option) => (
                <li key={option.id} className="mb-1">
                  ID: {option.id.substring(0, 8)}... - {option.title}
                </li>
              ))}
              {(!options || options.length === 0) && (
                <li className="italic">No options available</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
