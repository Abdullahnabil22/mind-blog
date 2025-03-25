import React from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { SiGoogletranslate } from "react-icons/si";
import { MdOutlineSummarize } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { useTheme } from "../../../../hooks/useTheme";
import { Button } from "@mantine/core";

export function AIAssistant({
  isVisible,
  selectedText,
  aiResult,
  isLoading,
  onClose,
  onAction,
}) {
  const { isDark } = useTheme();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed right-4 top-20 w-80 shadow-xl rounded-lg overflow-hidden z-50 ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: isDark ? "#4B5563 #1F2937" : "#CBD5E0 #EDF2F7",
          }}
        >
          {/* Header */}
          <div
            className={`p-3 ${
              isDark ? "bg-gray-900" : "bg-blue-50"
            } flex justify-between items-center`}
          >
            <h3
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              AI Assistant
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Selected text section */}
            <div className="mb-4">
              <h4
                className={`text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Selected Text:
              </h4>
              <div
                className={`p-2 rounded text-sm ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {selectedText ? selectedText : "No text selected"}
              </div>
            </div>

            {/* AI Actions */}
            <div className="mb-4">
              <h4
                className={`text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                What would you like to do?
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="light"
                  className={`${isDark ? "hover:bg-gray-700" : ""}`}
                  onClick={() => onAction("summarize")}
                  disabled={!selectedText || isLoading}
                  size="xs"
                  color="blue"
                >
                  <MdOutlineSummarize
                    size={16}
                    style={{ marginRight: "6px" }}
                  />
                  Summarize
                </Button>
                <Button
                  variant="light"
                  className={`${isDark ? "hover:bg-gray-700" : ""}`}
                  onClick={() => onAction("translate-ar")}
                  disabled={!selectedText || isLoading}
                  size="xs"
                  color="green"
                >
                  <SiGoogletranslate size={16} style={{ marginRight: "6px" }} />
                  Arabic
                </Button>
                <Button
                  variant="light"
                  className={`${isDark ? "hover:bg-gray-700" : ""}`}
                  onClick={() => onAction("translate-fr")}
                  disabled={!selectedText || isLoading}
                  size="xs"
                  color="indigo"
                >
                  <SiGoogletranslate size={16} style={{ marginRight: "6px" }} />
                  French
                </Button>
                <Button
                  variant="light"
                  className={`${isDark ? "hover:bg-gray-700" : ""}`}
                  onClick={() => onAction("translate-es")}
                  disabled={!selectedText || isLoading}
                  size="xs"
                  color="purple"
                >
                  <SiGoogletranslate size={16} style={{ marginRight: "6px" }} />
                  Spanish
                </Button>
                <Button
                  variant="light"
                  className={`${isDark ? "hover:bg-gray-700" : ""}`}
                  onClick={() => onAction("translate-en")}
                  disabled={!selectedText || isLoading}
                  size="xs"
                  color="red"
                >
                  <SiGoogletranslate size={16} style={{ marginRight: "6px" }} />
                  English
                </Button>
                <Button
                  variant="light"
                  className={`${isDark ? "hover:bg-gray-700" : ""}`}
                  onClick={() => onAction("improve")}
                  disabled={!selectedText || isLoading}
                  size="xs"
                  color="yellow"
                >
                  <BiEdit size={16} style={{ marginRight: "6px" }} />
                  Improve
                </Button>
              </div>
            </div>

            {/* AI Response */}
            {isLoading ? (
              <div className="flex flex-col items-center py-6">
                <div className="border-4 border-gray-200 border-t-green-500 h-8 rounded-full w-8 animate-spin mb-2"></div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Processing your request...
                </p>
              </div>
            ) : aiResult ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h4
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    AI Result:
                  </h4>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      navigator.clipboard.writeText(aiResult);
                    }}
                    color="green"
                  >
                    <FaCopy size={12} style={{ marginRight: "6px" }} />
                    Copy
                  </Button>
                </div>
                <div
                  className={`p-3 rounded mb-3 text-sm ${
                    isDark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-blue-50 text-gray-700"
                  }`}
                  style={{ maxHeight: "200px", overflow: "auto" }}
                >
                  {aiResult}
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
