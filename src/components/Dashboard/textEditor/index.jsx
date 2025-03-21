import React, { useEffect, useState, useRef } from "react";
import { EditorContent, BubbleMenu } from "@tiptap/react";
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  Palette, 
  Quote, 
  Terminal,
  X
} from "lucide-react";
import { FormatButton } from "./FormatButton";
import { DebugPanel } from "../../Debug/DebugPanel";
import { useTextEditor } from "./useTextEditor";
import { EditorToolbar } from "./EditorToolbar";

// Global style for editor
const editorStyles = `
  /* Base typography */
  .ProseMirror {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  }

  /* Headings */
  .ProseMirror h1 { font-size: 2rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 1rem; }
  .ProseMirror h2 { font-size: 1.75rem; font-weight: bold; margin-top: 1.25rem; margin-bottom: 0.75rem; }
  .ProseMirror h3 { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
  .ProseMirror h4 { font-size: 1.25rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.5rem; }
  .ProseMirror h5 { font-size: 1.1rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.5rem; }
  .ProseMirror h6 { font-size: 1rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.5rem; }

  /* Lists */
  .ProseMirror ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 0.5rem 0 !important; }
  .ProseMirror ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 0.5rem 0 !important; }
  .ProseMirror li { margin: 0.25rem 0 !important; display: list-item !important; }
  .ProseMirror li p { margin: 0 !important; }

  /* Blockquote */
  .ProseMirror blockquote {
    border-left: 4px solid #d1d5db;
    padding-left: 1rem;
    font-style: italic;
    margin: 1rem 0;
  }

  /* Code blocks */
  .ProseMirror pre {
    background-color: #f3f4f6;
    border-radius: 0.25rem;
    padding: 0.75rem;
    overflow-x: auto;
    margin: 1rem 0;
    font-family: monospace;
  }

  /* Inline code */
  .ProseMirror code {
    background-color: #f3f4f6;
    border-radius: 0.25rem;
    padding: 0.1rem 0.3rem;
    font-family: monospace;
    font-size: 0.9em;
  }

  /* Dark mode */
  .dark .ProseMirror pre, .dark .ProseMirror code {
    background-color: rgba(153, 102, 51, 0.2);
  }
  
  .dark .ProseMirror blockquote {
    border-left-color: #92400e;
  }
`;

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

  const [isBubbleColorMenuOpen, setBubbleColorMenuOpen] = useState(false);
  const bubbleColorMenuRef = useRef(null);
  const bubbleColorButtonRef = useRef(null);
  
  // Handle click outside for bubble color menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (isBubbleColorMenuOpen && 
          bubbleColorMenuRef.current && 
          !bubbleColorMenuRef.current.contains(event.target) && 
          bubbleColorButtonRef.current && 
          !bubbleColorButtonRef.current.contains(event.target)) {
        setBubbleColorMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBubbleColorMenuOpen]);

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
        <div className={`text-sm ${isDark ? "text-amber-200/70" : "text-gray-500"}`}>
          Loading note data...
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className={`text-lg font-medium ${isDark ? "text-amber-100" : "text-gray-800"}`}>
          No Note Selected
        </div>
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
        <div className={`text-lg font-medium ${isDark ? "text-amber-100" : "text-gray-800"}`}>
          Invalid Note ID
        </div>
        <div className={`text-sm max-w-md ${isDark ? "text-amber-200/70" : "text-gray-500"}`}>
          The note ID "{id}" is not valid. Please select a note from the sidebar.
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="flex flex-col p-4 text-center gap-4 items-center">
        <div className={`text-lg font-medium ${isDark ? "text-amber-100" : "text-gray-800"}`}>
          Note not found
        </div>
        <div className={`text-sm max-w-md ${isDark ? "text-amber-200/70" : "text-gray-500"}`}>
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
      <style>{editorStyles}</style>
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
            exportContent={exportContent}
            importContent={importContent}
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
            <EditorContent 
              editor={editor} 
              style={{ whiteSpace: 'pre-wrap' }}
            />
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
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className={`p-1 rounded-lg shadow-lg flex flex-col gap-1 ${
              isDark
                ? "bg-[#001F10] border border-amber-900/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex gap-1 mb-1">
              <FormatButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                icon={Bold}
                tooltip="Bold"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                icon={Italic}
                tooltip="Italic"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                icon={Strikethrough}
                tooltip="Strikethrough"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                icon={Code}
                tooltip="Code"
                size={16}
              />
              <FormatButton
                onClick={addLink}
                isActive={editor.isActive("link")}
                icon={LinkIcon}
                tooltip="Add Link"
                size={16}
              />
            </div>
            <div className="flex border-gray-200 border-t dark:border-amber-900/30 gap-1 mb-1 pt-1">
              <FormatButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                icon={Heading1}
                tooltip="Heading 1"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                tooltip="Heading 2"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                icon={Heading3}
                tooltip="Heading 3"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                icon={Quote}
                tooltip="Blockquote"
                size={16}
              />
              <FormatButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                icon={Terminal}
                tooltip="Code Block"
                size={16}
              />
            </div>
            <div className="flex border-gray-200 border-t dark:border-amber-900/30 gap-1 pt-1">
              <div className="relative">
                <div ref={bubbleColorButtonRef}>
                  <FormatButton
                    onClick={() => setBubbleColorMenuOpen(!isBubbleColorMenuOpen)}
                    icon={Palette}
                    tooltip="Text Color"
                    isActive={editor.isActive("textStyle")}
                    size={16}
                  />
                </div>
                {isBubbleColorMenuOpen && (
                  <div
                    ref={bubbleColorMenuRef}
                    className={`absolute z-50 left-0 top-full mt-1 p-2 rounded-md shadow-lg grid grid-cols-4 gap-2 ${
                      isDark
                        ? "bg-[#001F10] border border-amber-900/50"
                        : "bg-white border border-gray-200"
                    }`}
                    style={{ width: "150px" }}
                  >
                    {colorPresets.slice(0, 8).map((preset) => (
                      <button
                        key={preset.color}
                        className="flex h-6 justify-center rounded-full w-6 cursor-pointer hover:scale-110 items-center transition-transform"
                        style={{
                          backgroundColor: preset.color,
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                        title={preset.name}
                        onClick={(e) => {
                          e.preventDefault();
                          setTextColor(preset.color);
                          setBubbleColorMenuOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <FormatButton
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                tooltip="Clear Formatting"
                icon={X}
                size={16}
              />
            </div>
          </BubbleMenu>
        )}
      </div>
    </>
  );
}
