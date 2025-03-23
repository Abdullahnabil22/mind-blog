import { RichTextEditor } from "@mantine/tiptap";
import "@mantine/tiptap/styles.css";
import {
  IconDeviceFloppy,
  IconSourceCode,
  IconRobot,
} from "@tabler/icons-react";
import { useEditorWithMantine } from "./hooks/useEditor";
import { useTheme } from "../../../hooks/useTheme";
import { LoadingSection } from "./Sections/loadingSction";
import { BubbleMenu } from "@tiptap/react";
import { MantineProvider, Button } from "@mantine/core";
import "./style.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { processTextWithAI } from "../../../services/aiService";
import toast from "react-hot-toast";
import { AIAssistant } from "./Sections/AIAssistant";

// Custom notification function to ensure compatibility
const showNotification = (message, type = "default") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
    case "warning":
    default:
      toast(message);
      break;
  }
};

export function Editor() {
  const { isDark, theme } = useTheme();
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const {
    editor,
    currentNote,
    hasChanges,
    isLoading,
    setIsEditorReady,
    autoSaveStatus,
    handleSaveContent,
    wordCount,
    characterCount,
    formatLastSaved,
    setHasChanges,
  } = useEditorWithMantine();

  // AI Assistant state
  const [selectedText, setSelectedText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Reference to track processing status
  const isProcessingRef = useRef(false);

  const handleRightClick = (event) => {
    if (!editor) return;

    const selection = window.getSelection().toString().trim();
    if (selection) {
      setSelectedText(selection);
      setAiAssistantVisible(true);
      event.preventDefault();
    }
  };

  // Handler for AI actions (rewrite, continue, etc)
  const handleAction = useCallback(
    async (action) => {
      if (!action) {
        // User closed the menu
        return;
      }

      if (
        !editor ||
        isProcessingRef.current ||
        !currentNote?.id ||
        !selectedText
      ) {
        console.log("Early return conditions:", {
          "editor missing": !editor,
          "is processing": isProcessingRef.current,
          "note id missing": !currentNote?.id,
          "selected text missing": !selectedText,
        });
        return;
      }

      try {
        isProcessingRef.current = true;
        setAiProcessing(true);
        setAiResult("");

        // Process the request with AI
        const result = await processTextWithAI(
          selectedText,
          action,
          currentNote.id
        );

        // Error handling for AI processing
        if (!result) {
          showNotification("Failed to process request", "error");
          setAiProcessing(false);
          isProcessingRef.current = false;
          return;
        }

        // Store the AI result for display
        setAiResult(result);
        setHasChanges(true);
      } catch (error) {
        console.error("Error in handleAction:", error);
        showNotification(
          "An error occurred: " + (error.message || "Unknown error"),
          "error"
        );
      } finally {
        setAiProcessing(false);
        isProcessingRef.current = false;
      }
    },
    [editor, isProcessingRef, currentNote, setHasChanges, selectedText]
  );

  // Close the AI Assistant
  const handleCloseAiAssistant = useCallback(() => {
    setAiAssistantVisible(false);
    setAiResult("");
  }, []);

  // Color presets
  const colorPresets = [
    { color: "#E03131", name: "Red" },
    { color: "#2F9E44", name: "Green" },
    { color: "#1971C2", name: "Blue" },
    { color: "#F08C00", name: "Orange" },
    { color: "#6741D9", name: "Purple" },
    { color: "#0CA678", name: "Teal" },
    { color: "#E64980", name: "Pink" },
    { color: "#3BC9DB", name: "Cyan" },
  ];

  // Function to open AI Assistant with current selection
  const openAIAssistant = () => {
    if (!editor) return;

    const selection = window.getSelection().toString().trim();
    if (selection) {
      setSelectedText(selection);
      setAiAssistantVisible(true);
    } else {
      showNotification("Please select some text first", "info");
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSection />;
  }
  // Initialize editor warning
  if (!editor) {
    return (
      <>
        <div className="flex flex-col p-4 text-center items-center">
          <div className="mb-4">Preparing editor...</div>
          <div className="border-4 border-gray-200 border-t-green-500 h-8 rounded-full w-8 animate-spin"></div>
          <button
            onClick={() => setIsEditorReady(true)}
            className={`mt-8 px-4 py-2 rounded-md hover:bg-gray-300 text-sm cursor-pointer ${
              isDark
                ? "bg-amber-900/10 text-amber-100"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Editor stuck? Click to continue anyway
          </button>
        </div>
      </>
    );
  }
  const codeIcon = () => <IconSourceCode size={16} stroke={3.5} />;
  const aiIcon = () => <IconRobot size={16} stroke={3.5} />;
  return (
    <MantineProvider>
      <div className="flex flex-col" onContextMenu={handleRightClick}>
        {/* Note info header */}
        {currentNote && (
          <div
            className={`mb-2 px-3 py-2 flex justify-between items-center rounded-md ${
              isDark ? "bg-amber-900/10" : "bg-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-medium ${
                isDark ? "text-amber-100" : "text-gray-800"
              }`}
            >
              {currentNote?.title || "Untitled Note"}
            </h2>
            <div className="flex gap-2 items-center">
              <span
                className={`text-xs ${
                  isDark ? "text-amber-200/70" : "text-gray-500"
                }`}
              >
                {hasChanges ? (
                  <span className="text-amber-500">Unsaved changes</span>
                ) : (
                  formatLastSaved()
                )}
              </span>
            </div>
          </div>
        )}

        {/* Save button */}
        <div
          className={`mb-2 p-2 rounded-lg border flex flex-wrap gap-1 ${
            isDark
              ? "border-amber-100 bg-[#001F10] text-amber-100"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <button
            onClick={() => handleSaveContent(true)}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              isDark ? "hover:bg-amber-900/50" : "hover:bg-gray-200"
            } ${hasChanges ? `animate-pulse bg-green-700/70 text-white` : ""}`}
            title="Save"
          >
            <IconDeviceFloppy size={18} />
          </button>
          <div className="bg-gray-300 h-6 w-px mx-1 self-center" />
          <span className="text-sm self-center">
            {wordCount} words • {characterCount} characters
          </span>
          <div className="ml-auto text-sm self-center me-2 font-bold">
            <span
              className={`${
                autoSaveStatus === "saving" || autoSaveStatus === "pending"
                  ? "animate-pulse text-yellow-500"
                  : autoSaveStatus === "saved"
                  ? "text-green-500"
                  : hasChanges
                  ? "text-amber-500 font-bold"
                  : ""
              }`}
            >
              {autoSaveStatus === "saving" || autoSaveStatus === "pending"
                ? "Saving..."
                : autoSaveStatus === "saved"
                ? "Changes saved"
                : hasChanges
                ? "⚠️ Unsaved changes"
                : "Ready to Write"}
            </span>
          </div>
        </div>
        {/* Text Editor */}
        <RichTextEditor
          editor={editor}
          style={{
            minHeight: "68vh",
            border: "unset",
            background: "",
            color: isDark ? "#ffefd4" : "inherit",
          }}
        >
          <RichTextEditor.Toolbar
            className={`${
              isDark ? "custom-dark-toolbar" : "custom-light-toolbar"
            }`}
          >
            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
              <RichTextEditor.H5 />
              <RichTextEditor.H6 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.CodeBlock icon={codeIcon} />
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.TaskList />
              <RichTextEditor.TaskListLift />
              <RichTextEditor.TaskListSink />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.ColorPicker
                colors={[
                  "#25262b",
                  "#868e96",
                  "#fa5252",
                  "#e64980",
                  "#be4bdb",
                  "#7950f2",
                  "#4c6ef5",
                  "#228be6",
                  "#15aabf",
                  "#12b886",
                  "#40c057",
                  "#82c91e",
                  "#fab005",
                  "#fd7e14",
                ]}
                className={`${
                  isDark
                    ? "custom-dark-colorPicker"
                    : "custom-light-colorPicker"
                }`}
              />
              <RichTextEditor.UnsetColor />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              {colorPresets.map((preset) => (
                <RichTextEditor.Color
                  key={preset.color}
                  color={preset.color}
                  title={preset.name}
                />
              ))}
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup
              className={`${
                isDark ? "custom-dark-button" : "custom-light-button"
              }`}
            >
              <RichTextEditor.Control
                onClick={openAIAssistant}
                title="AI Assistant"
                className={`${
                  isDark
                    ? "text-amber-300 hover:bg-amber-900/50"
                    : "text-blue-500 hover:bg-gray-200"
                }`}
              >
                {aiIcon()}
              </RichTextEditor.Control>
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className={`p-1.5 rounded-lg shadow-lg flex flex-col gap-1 ${
                isDark
                  ? "bg-[#001F10] border border-amber-100 custom-dark-button"
                  : "bg-white border border-gray-200"
              }`}
            >
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
                <RichTextEditor.Link />
              </RichTextEditor.ControlsGroup>
            </BubbleMenu>
          )}
          <RichTextEditor.Content
            className={`${
              isDark ? "custom-dark-content" : "custom-light-content"
            }`}
          />
        </RichTextEditor>

        {/* AI Assistant Component */}
        <AIAssistant
          isVisible={aiAssistantVisible}
          selectedText={selectedText}
          aiResult={aiResult}
          isLoading={aiProcessing}
          onClose={handleCloseAiAssistant}
          onAction={handleAction}
        />
      </div>
    </MantineProvider>
  );
}
