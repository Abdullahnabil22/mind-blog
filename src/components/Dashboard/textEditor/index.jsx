import React, { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import { useTextEditor } from "./useTextEditor";
import { EditorToolbar } from "./EditorToolbar";
import { BubbleMenuComponent } from "./BubbleMenu";

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
    setTextColor,
    handleSaveContent,
    id,
    retryCount: _retryCount,
    setRetryCount,
    setCurrentNote,
    refreshCurrentNote,
    setIsEditorReady,
  } = useTextEditor();

  // Force editor ready if it takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isEditorReady && editor) {
        setIsEditorReady(true);
      }
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [editor, isEditorReady, setIsEditorReady]);

  if (isLoading) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className="border-4 border-gray-200 border-t-green-500 h-8 rounded-full w-8 animate-spin"></div>
        <div
          className={`text-sm ${
            isDark ? "text-amber-200/70" : "text-gray-500"
          }`}
        >
          Loading note data...
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div
          className={`text-lg font-medium ${
            isDark ? "text-amber-100" : "text-gray-800"
          }`}
        >
          No Note Selected
        </div>
        <div
          className={`text-sm max-w-md ${
            isDark ? "text-amber-200/70" : "text-gray-500"
          }`}
        >
          Please select a note from the sidebar to start editing.
        </div>
      </div>
    );
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidNoteId = uuidPattern.test(id);

  if (!isValidNoteId) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div
          className={`text-lg font-medium ${
            isDark ? "text-amber-100" : "text-gray-800"
          }`}
        >
          Invalid Note ID
        </div>
        <div
          className={`text-sm max-w-md ${
            isDark ? "text-amber-200/70" : "text-gray-500"
          }`}
        >
          The note ID "{id}" is not valid. Please select a note from the
          sidebar.
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div
          className={`text-lg font-medium ${
            isDark ? "text-amber-100" : "text-gray-800"
          }`}
        >
          Note not found
        </div>
        <div
          className={`text-sm max-w-md ${
            isDark ? "text-amber-200/70" : "text-gray-500"
          }`}
        >
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

          <EditorToolbar
            editor={editor}
            handleSaveContent={handleSaveContent}
            addLink={addLink}
            isDark={isDark}
            hasChanges={hasChanges}
            colorPresets={colorPresets}
            setTextColor={setTextColor}
          />

          <div
            className={`flex flex-col overflow-auto min-h-[60vh] rounded-b-lg
              ${isDark ? "border-amber-900/50 text-amber-100" : ""}
              [&_.ProseMirror]:whitespace-pre-wrap
              [&_.ProseMirror]:break-words
              [&_.ProseMirror_p]:my-3
              [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-4
              [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-3
              [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2
              [&_.ProseMirror_h4]:text-lg [&_.ProseMirror_h4]:font-bold [&_.ProseMirror_h4]:mt-4 [&_.ProseMirror_h4]:mb-2
              [&_.ProseMirror_h5]:text-base [&_.ProseMirror_h5]:font-bold [&_.ProseMirror_h5]:mt-4 [&_.ProseMirror_h5]:mb-2
              [&_.ProseMirror_h6]:text-sm [&_.ProseMirror_h6]:font-bold [&_.ProseMirror_h6]:mt-4 [&_.ProseMirror_h6]:mb-2
              [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:my-3
              [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:my-3
              [&_.ProseMirror_li]:my-1 [&_.ProseMirror_li_p]:my-0
            `}
          >
            <EditorContent editor={editor} style={{ whiteSpace: "pre-wrap" }} />
          </div>

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

        {editor && (
          <BubbleMenuComponent
            editor={editor}
            addLink={addLink}
            isDark={isDark}
          />
        )}
      </div>
    </>
  );
}
