import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useNotes } from "../../../stores/useNotesStore";
import { useTheme } from "../../../hooks/useTheme";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import toast from "react-hot-toast";

export function useTextEditor() {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const { id } = useParams();
  const [editorContent, setEditorContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const hasInitialized = useRef(false);
  const editorInitTimeout = useRef(null);
  const autoSaveTimeout = useRef(null);
  const handleSaveContentRef = useRef(null);

  // Get note data from the store
  const {
    currentNote,
    setCurrentNote,
    updateNote,
    isLoading,
    refreshCurrentNote,
  } = useNotes();

  // Add state to track retry attempts
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Track auto-save status
  const [autoSaveStatus, setAutoSaveStatus] = useState("enabled");

  // 1. Component initialization and cleanup - combine related effects
  useEffect(() => {
    // Clear state if no ID is present or if ID format doesn't match UUID pattern
    // This handles folder clicks which don't have a note ID in the URL
    if (!id) {
      setIsEditorReady(true);
      setHasChanges(false);
      setAutoSaveStatus("enabled");
      hasInitialized.current = false;
      return;
    }

    // UUID pattern matching for note IDs (most database UUIDs follow this pattern)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidNoteId = uuidPattern.test(id);

    // Only try to set current note if it looks like a valid note ID, not a folder ID
    if (!hasInitialized.current && isValidNoteId) {
      setCurrentNote(id);
      hasInitialized.current = true;
    }

    // If it's not a valid note ID (likely a folder), reset the editor state
    if (!isValidNoteId) {
      setIsEditorReady(true);
      setHasChanges(false);
      setAutoSaveStatus("enabled");
      // Clear any editor content to prevent showing previous note content
      if (editor) {
        editor.commands.setContent("");
      }
      setEditorContent("");
    }

    // Cleanup function
    return () => {
      hasInitialized.current = false;

      // Clear all timeouts
      if (editorInitTimeout.current) {
        clearTimeout(editorInitTimeout.current);
      }
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [id, setCurrentNote]);

  // 2. Combine the note fetching retry logic
  useEffect(() => {
    // Only attempt retries if id exists and looks like a valid UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidNoteId = id && uuidPattern.test(id);
    
    // Retry fetching if note is not found initially but ID is valid
    let retryTimer;
    if (isValidNoteId && !currentNote && !isLoading && retryCount < maxRetries) {
      retryTimer = setTimeout(() => {
        refreshCurrentNote && refreshCurrentNote();
        setRetryCount((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [id, currentNote, isLoading, retryCount, refreshCurrentNote, maxRetries]);

  // 3. Process note content immediately after currentNote changes
  useEffect(() => {
    if (currentNote) {
      let noteContent = "";

      if (currentNote.markdown) {
        noteContent = currentNote.markdown;
      } else if (currentNote.content) {
        // Handle different types of content more intelligently
        if (typeof currentNote.content === "object") {
          // If it's an empty object, set empty string
          if (Object.keys(currentNote.content).length === 0) {
            noteContent = "";
          } else {
            // Try to parse it properly, but fallback to empty if it fails
            try {
              // This will handle JSON content from TipTap more elegantly
              noteContent = currentNote.content.content
                ? currentNote.content.content
                : JSON.stringify(currentNote.content);
            } catch (e) {
              noteContent = "";
              toast.error(e);
            }
          }
        } else {
          noteContent = currentNote.content;
        }
      }

      // Remove literal "{}" if present
      if (noteContent === "{}") {
        noteContent = "";
      }

      setEditorContent(noteContent || "");
      // Reset the changes flag when loading a new note
      setHasChanges(false);
    }
  }, [currentNote]);

  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved yet";

    const now = new Date();
    const diff = now - lastSaved;

    // Format based on how long ago it was saved
    if (diff < 60000) {
      return "Saved just now";
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Saved ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `Saved at ${lastSaved.toLocaleTimeString()}`;
    }
  };

  // Color presets with better colors that work in both light/dark modes
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

  // Define the editor first, with a simpler onUpdate that doesn't reference functions defined later
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "my-2 whitespace-pre-wrap",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "mt-4 mb-2",
        },
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Start writing here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-4 min-h-[300px] whitespace-pre-wrap",
        spellcheck: "true",
      },
    },
    // Instead of using onUpdate which causes the space issue, use onBlur
    onBlur: ({ editor }) => {
      if (!editor || !currentNote) return;

      // Only save when user stops editing (on blur)
      const html = editor.getHTML();

      // Mark changes
      setHasChanges(true);
      setEditorContent(html);

      try {
        console.log("Saving content on blur...");
        // Save to backend
        updateNote({
          id: currentNote.id,
          title: currentNote.title,
          content: html,
          markdown: html,
          folder_id: currentNote.folder_id,
        });

        // Update last saved time and status
        setLastSaved(new Date());
        setHasChanges(false);
        setAutoSaveStatus("saved");

        // Reset status after a delay
        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);
      } catch (error) {
        console.error("Save failed:", error);
        setAutoSaveStatus("failed");

        // Reset status after a delay
        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);
      }
    },
    // Add change detection without saving
    onUpdate: ({ editor }) => {
      setHasChanges(true);
      setAutoSaveStatus("pending");

      // Auto-save after typing stops (debounced)
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }

      // Set a timeout to auto-save after inactivity
      autoSaveTimeout.current = setTimeout(() => {
        if (!editor || !currentNote) return;

        const html = editor.getHTML();
        setEditorContent(html);

        try {
          console.log("Auto-saving content after inactivity...");
          updateNote({
            id: currentNote.id,
            title: currentNote.title,
            content: html,
            markdown: html,
            folder_id: currentNote.folder_id,
          });

          setLastSaved(new Date());
          setHasChanges(false);
          setAutoSaveStatus("saved");

          setTimeout(() => {
            setAutoSaveStatus("enabled");
          }, 3000);
        } catch (error) {
          console.error("Auto-save failed:", error);
          setAutoSaveStatus("failed");

          setTimeout(() => {
            setAutoSaveStatus("enabled");
          }, 3000);
        }
      }, 2000); // Increased to 2 seconds for better performance
    },
    onReady: () => {
      // Add a slight delay before marking editor as ready to ensure everything is initialized
      editorInitTimeout.current = setTimeout(() => {
        setIsEditorReady(true);
      }, 100);
    },
  });

  // Save content functionality - defined after editor
  const handleSaveContent = useCallback(
    (showToast = true) => {
      if (!currentNote || !editor) return;

      try {
        // Use editor.getHTML() directly without space replacement
        const content = editor.getHTML();

        // Don't save if content is empty object or actual empty string
        if (content === "{}" || content === "") {
          return;
        }

        // Set status before saving
        setAutoSaveStatus("pending");

        updateNote({
          id: currentNote.id,
          title: currentNote.title,
          content: content,
          markdown: content,
          folder_id: currentNote.folder_id,
        });

        // Update last saved time
        setLastSaved(new Date());

        // Reset changes flag
        setHasChanges(false);

        // Update status after saving
        setAutoSaveStatus("saved");

        // Reset status after a delay
        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);

        if (showToast) {
          toast.success("Note saved successfully!");
        }
      } catch (error) {
        setAutoSaveStatus("failed");

        // Reset status after a delay
        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);

        if (showToast) {
          toast.error(
            "Failed to save note: " + (error.message || "Unknown error")
          );
        }
      }
    },
    [currentNote, editor, updateNote]
  );

  // Set the ref to the save function
  useEffect(() => {
    handleSaveContentRef.current = handleSaveContent;
  }, [handleSaveContent]);

  // Define callback functions after the editor is initialized
  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const exportContent = useCallback(() => {
    const blob = new Blob([editorContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentNote?.title
      ? `${currentNote.title}.html`
      : "document.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [editorContent, currentNote]);

  const importContent = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt,.md";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.commands.setContent(e.target.result);
          // Automatically save after import
          setTimeout(() => handleSaveContent(), 500);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [editor, handleSaveContent]);

  const setTextColor = useCallback(
    (color) => {
      if (!editor) return;
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  // All effects that depend on editor are defined after editor initialization

  // Visibility change handler
  useEffect(() => {
    if (!editor) return; // Only run when editor is available

    const handleVisibilityChange = () => {
      // When tab becomes hidden, save content immediately
      if (document.visibilityState === "hidden" && hasChanges) {
        console.log("Tab hidden, saving content...");
        if (handleSaveContentRef.current) {
          handleSaveContentRef.current(false);
        }
      }

      // When tab becomes visible again, refresh content if needed
      if (document.visibilityState === "visible" && currentNote) {
        console.log("Tab visible, refetching content from server...");

        // Force refetch the current note from the server
        if (refreshCurrentNote) {
          refreshCurrentNote();

          // After refetching, set a flag or directly update the note content
          setHasChanges(false);

          // We don't need to manually update the editor content here
          // The useEffect that watches for currentNote changes will handle it
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [editor, hasChanges, currentNote, refreshCurrentNote]);

  // Editor content initialization
  useEffect(() => {
    if (!editor || !isEditorReady) return;

    if (currentNote) {
      try {
        let noteContent = "";

        if (currentNote.markdown) {
          noteContent = currentNote.markdown;
        } else if (currentNote.content) {
          if (typeof currentNote.content === "object") {
            if (Object.keys(currentNote.content).length === 0) {
              noteContent = "";
            } else {
              try {
                noteContent = currentNote.content.content || JSON.stringify(currentNote.content);
              } catch {
                noteContent = "";
                toast.error("Error parsing note content");
              }
            }
          } else {
            noteContent = currentNote.content;
          }
        }

        // Remove literal "{}" if present
        if (noteContent === "{}") {
          noteContent = "";
        }

        // Set editor content
        editor.commands.setContent(noteContent);
        setEditorContent(noteContent);
        
        // Reset changes flag after loading content
        setHasChanges(false);
      } catch (error) {
        toast.error("Error loading note content: " + error.message);
      }
    }
  }, [editor, isEditorReady, currentNote]);

  // Force editor ready timeout
  useEffect(() => {
    if (!editor) return;

    // Force editor ready after timeout to prevent infinite "preparing editor" state
    let readyTimeoutId;
    if (!isEditorReady) {
      readyTimeoutId = setTimeout(() => {
        setIsEditorReady(true);
      }, 1000); // Reduced to 1 second for better UX
    }

    return () => {
      if (readyTimeoutId) clearTimeout(readyTimeoutId);
    };
  }, [editor, isEditorReady]);

  // Paste handler
  useEffect(() => {
    if (!editor) return;

    // Define a function to handle paste events
    const handlePaste = (event) => {
      const editorElement = document.querySelector(".ProseMirror");
      if (!editorElement || !event.target.closest(".ProseMirror")) return;
      // Let the editor handle paste normally
    };

    // Add event listener
    document.addEventListener("paste", handlePaste);

    // Clean up
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [editor]);

  // Calculate word and character counts - now these are safe because editor is defined before
  const wordCount = editor
    ? editor
        .getText()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;
  const characterCount = editor ? editor.getText().length : 0;

  return {
    editor,
    currentNote,
    hasChanges,
    isEditorReady,
    isLoading,
    editorContent,
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
    retryCount,
    setRetryCount,
    setCurrentNote,
    refreshCurrentNote,
    setIsEditorReady,
  };
}
