import React from "react";
import { EditorContent, BubbleMenu } from "@tiptap/react";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";
import { FormatButton } from "./FormatButton";
import { DebugPanel } from "../../Debug/DebugPanel";
import { useTextEditor } from "./useTextEditor";
import { EditorToolbar } from "./EditorToolbar";

export function TextEditor() {
  const {
    editor,
    currentNote,
    hasChanges,
    isEditorReady,
    isLoading,
    colorPresets,
    autoSaveStatus,
    isDark,
    wordCount,
    characterCount,
    formatLastSaved,
    addLink,
    exportContent,
    importContent,
    setTextColor,
    handleSaveContent,
    id,
    retryCount: _retryCount,
    setRetryCount,
    setCurrentNote,
    refreshCurrentNote,
    setIsEditorReady,
  } = useTextEditor();

  if (isLoading) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className="border-4 border-gray-200 border-t-green-500 h-8 rounded-full w-8 animate-spin"></div>
        <div className="text-gray-500 text-sm">Loading note data...</div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className={`text-lg font-medium ${isDark ? "text-amber-100" : "text-gray-800"}`}>No Note Selected</div>
        <div className={`text-sm max-w-md ${isDark ? "text-amber-200/70" : "text-gray-500"}`}>
          Please select a note from the sidebar to start editing.
        </div>
      </div>
    );
  }

  // Check if the ID is in a valid UUID format
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidNoteId = uuidPattern.test(id);

  if (!isValidNoteId) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className={`text-lg font-medium ${isDark ? "text-amber-100" : "text-gray-800"}`}>Folder Selected</div>
        <div className={`text-sm max-w-md ${isDark ? "text-amber-200/70" : "text-gray-500"}`}>
          This appears to be a folder. Please select a note from the sidebar to edit.
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className="text-lg font-medium">Note not found</div>
        <div className="text-gray-500 text-sm max-w-md">
          The note with ID "{id}" could not be found. It may have been deleted
          or you don't have permission to view it.
        </div>

        <button
          onClick={() => {
            setRetryCount(0);
            setCurrentNote(id);
            refreshCurrentNote && refreshCurrentNote();
          }}
          className={`px-4 py-2 rounded-md mt-4 transition-colors ${
            isDark
              ? "bg-amber-700 hover:bg-amber-600 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          Retry Loading Note
        </button>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Editor is initializing...</div>
      </div>
    );
  }

  if (!isEditorReady) {
    return (
      <div className="flex flex-col p-4 text-center items-center">
        <div className="mb-4">Preparing editor...</div>
        <div className="border-4 border-gray-200 border-t-green-500 h-8 rounded-full w-8 animate-spin"></div>
        <button
          onClick={() => setIsEditorReady(true)}
          className={`mt-8 px-4 py-2  rounded-md hover:bg-gray-300 text-sm cursor-pointer ${
            isDark
              ? "bg-amber-900/10 text-amber-100"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Editor stuck? Click to continue anyway
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-transparent">
        <div className="container mx-auto relative">
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
              {currentNote.title}
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

          {/* Editor Toolbar Components */}
          <EditorToolbar
            editor={editor}
            handleSaveContent={handleSaveContent}
            exportContent={exportContent}
            importContent={importContent}
            addLink={addLink}
            isDark={isDark}
            hasChanges={hasChanges}
            colorPresets={colorPresets}
            setTextColor={setTextColor}
          />

          {/* Editor Content Area - add specific CSS for space preservation */}
          <div
            className={`flex flex-col overflow-auto min-h-[60vh] rounded-b-lg
              ${isDark ? "border-amber-900/50 text-amber-100" : ""}
              [&_.ProseMirror]:whitespace-pre-line
              [&_.ProseMirror]:break-words
              [&_.ProseMirror_p]:my-3
              [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-4
              [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-3
              [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2
            `}
          >
            <EditorContent 
              editor={editor} 
              style={{ whiteSpace: 'pre-line' }}
            />
          </div>

          {/* Auto-save indicator */}
          <div
            className={`m-2 text-sm self-end align-bottom absolute bottom-0 right-0 ${
              isDark ? "text-amber-200" : "text-gray-500"
            }`}
          >
            {wordCount} words • {characterCount} characters •
            <span
              className={`ml-1 text-xs ${
                autoSaveStatus === "saving"
                  ? "animate-pulse text-yellow-500"
                  : autoSaveStatus === "saved"
                  ? "text-green-500"
                  : hasChanges || autoSaveStatus === "unsaved"
                  ? "text-amber-500 font-bold"
                  : ""
              }`}
            >
              {autoSaveStatus === "saving"
                ? "Saving..."
                : autoSaveStatus === "saved"
                ? "Changes saved"
                : hasChanges || autoSaveStatus === "unsaved"
                ? "⚠️ Unsaved changes - Click save button"
                : "Ready to edit"}
            </span>
          </div>

          {/* Save reminder banner - only shows when there are unsaved changes */}
          {(hasChanges || autoSaveStatus === "unsaved") && (
            <div
              className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-opacity duration-300 ${
                isDark
                  ? "bg-amber-900 text-white"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-300"
              }`}
            >
              <span className="text-sm">
                Don't forget to save your changes!
              </span>
              <button
                onClick={() => handleSaveContent(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  isDark
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-600 hover:bg-green-500 text-white"
                }`}
              >
                Save now
              </button>
            </div>
          )}
        </div>

        {/* Bubble Menu - appears when selecting text */}
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className={`p-1 rounded-lg shadow-lg flex gap-1 ${
              isDark
                ? "bg-[#001F10] border border-amber-900/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <FormatButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={Bold}
              tooltip="Bold"
              size={16}
            />
            <FormatButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={Italic}
              tooltip="Italic"
              size={16}
            />
            <FormatButton
              onClick={addLink}
              isActive={editor.isActive("link")}
              icon={LinkIcon}
              tooltip="Add Link"
              size={16}
            />
          </BubbleMenu>
        )}
      </div>
    </>
  );
}
