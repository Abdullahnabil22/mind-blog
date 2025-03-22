import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useNotes } from "../../../stores/useNotesStore";
import { useTheme } from "../../../hooks/useTheme";
import { useEditor } from "@tiptap/react";
import { all, createLowlight } from "lowlight";
import toast from "react-hot-toast";
import { getEditorConfig } from "./EditorConfig";

export function useTextEditor() {
  const { isDark } = useTheme();
  const { id } = useParams();
  const [editorContent, setEditorContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const hasInitialized = useRef(false);
  const editorInitTimeout = useRef(null);
  const autoSaveTimeout = useRef(null);
  const handleSaveContentRef = useRef(null);
  const contentAlreadySet = useRef(false);
  const lowlight = createLowlight(all);
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

  // Define the editor with the imported configuration
  const editor = useEditor(
    getEditorConfig({
      lowlight,
      onReady: () => setIsEditorReady(true),
      editorInitTimeout,
      isDark,
    })
  );

  // Add editor event handlers after initialization
  useEffect(() => {
    if (!editor) return;

    // Handle blur events
    editor.on("blur", () => {
      if (!currentNote) return;

      const html = editor.getHTML();
      setHasChanges(true);
      setEditorContent(html);

      try {
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
        setAutoSaveStatus("failed");
        toast.error(error);
        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);
      }
    });

    // Handle update events
    editor.on("update", () => {
      setHasChanges(true);
      setAutoSaveStatus("pending");

      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }

      autoSaveTimeout.current = setTimeout(() => {
        if (!currentNote) return;

        const html = editor.getHTML();
        setEditorContent(html);

        try {
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
          setAutoSaveStatus("failed");
          toast.error(error);
          setTimeout(() => {
            setAutoSaveStatus("enabled");
          }, 3000);
        }
      }, 2000);
    });

    return () => {
      editor.off("blur");
      editor.off("update");
    };
  }, [editor, currentNote, updateNote]);

  // 1. Component initialization and cleanup - combine related effects
  useEffect(() => {
    // Clear state if no ID is present or if ID format doesn't match UUID pattern
    if (!id) {
      setIsEditorReady(true);
      setHasChanges(false);
      setAutoSaveStatus("enabled");
      hasInitialized.current = false;
      contentAlreadySet.current = false;
      return;
    }

    // UUID pattern matching for note IDs
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidNoteId = uuidPattern.test(id);

    // Reset content set flag whenever ID changes
    contentAlreadySet.current = false;

    // Only try to set current note if it looks like a valid note ID
    if (!hasInitialized.current && isValidNoteId) {
      setCurrentNote(id);
      hasInitialized.current = true;
    }

    // If it's not a valid note ID (likely a folder), reset the editor state
    if (!isValidNoteId) {
      setIsEditorReady(true);
      setHasChanges(false);
      setAutoSaveStatus("enabled");
      if (editor) {
        editor.commands.setContent("");
      }
      setEditorContent("");
    }

    return () => {
      hasInitialized.current = false;
      if (editorInitTimeout.current) {
        clearTimeout(editorInitTimeout.current);
      }
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [id, setCurrentNote, editor]);

  // 2. Combine the note fetching retry logic
  useEffect(() => {
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidNoteId = id && uuidPattern.test(id);

    let retryTimer;
    if (
      isValidNoteId &&
      !currentNote &&
      !isLoading &&
      retryCount < maxRetries
    ) {
      retryTimer = setTimeout(() => {
        refreshCurrentNote && refreshCurrentNote();
        setRetryCount((prev) => prev + 1);
      }, 1000 * (retryCount + 1));
    }

    if (currentNote || !isValidNoteId) {
      if (retryCount > 0) {
        setRetryCount(0);
      }
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
        if (typeof currentNote.content === "object") {
          if (Object.keys(currentNote.content).length === 0) {
            noteContent = "";
          } else {
            try {
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

      if (noteContent === "{}") {
        noteContent = "";
      }

      setEditorContent(noteContent || "");
      setHasChanges(false);
    }
  }, [currentNote]);

  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved yet";

    const now = new Date();
    const diff = now - lastSaved;

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

  // Save content functionality
  const handleSaveContent = useCallback(
    (showToast = true) => {
      if (!currentNote || !editor) return;

      try {
        const content = editor.getHTML();

        if (content === "{}" || content === "") {
          return;
        }

        setAutoSaveStatus("pending");

        updateNote({
          id: currentNote.id,
          title: currentNote.title,
          content: content,
          markdown: content,
          folder_id: currentNote.folder_id,
        });

        setLastSaved(new Date());
        setHasChanges(false);
        setAutoSaveStatus("saved");

        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);

        if (showToast) {
          toast.success("Note saved successfully!");
        }
      } catch (error) {
        setAutoSaveStatus("failed");
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

  const setTextColor = useCallback(
    (color) => {
      if (!editor) return;
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Add https:// if protocol is missing
    const normalizedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: normalizedUrl })
      .run();
  }, [editor]);

  // Visibility change handler
  useEffect(() => {
    if (!editor) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasChanges) {
        if (handleSaveContentRef.current) {
          handleSaveContentRef.current(false);
        }
      }

      if (document.visibilityState === "visible" && currentNote) {
        if (refreshCurrentNote) {
          refreshCurrentNote();
          setHasChanges(false);
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

    if (currentNote && !contentAlreadySet.current) {
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
                noteContent =
                  currentNote.content.content ||
                  JSON.stringify(currentNote.content);
              } catch {
                noteContent = "";
                toast.error("Error parsing note content");
              }
            }
          } else {
            noteContent = currentNote.content;
          }
        }

        if (noteContent === "{}") {
          noteContent = "";
        }

        editor.commands.setContent(noteContent);
        setEditorContent(noteContent);
        contentAlreadySet.current = true;
        setHasChanges(false);
        setAutoSaveStatus("enabled");
      } catch (error) {
        toast.error("Error loading note content: " + error.message);
      }
    } else if (!currentNote) {
      editor.commands.setContent("");
      setEditorContent("");
      setHasChanges(false);
      setAutoSaveStatus("enabled");
      contentAlreadySet.current = false;
    }

    return () => {
      if (contentAlreadySet.current) {
        contentAlreadySet.current = false;
      }
    };
  }, [editor, isEditorReady, currentNote]);

  // Force editor ready timeout
  useEffect(() => {
    if (!editor) return;

    let readyTimeoutId;
    if (!isEditorReady) {
      readyTimeoutId = setTimeout(() => {
        setIsEditorReady(true);
      }, 1000);
    }

    return () => {
      if (readyTimeoutId) clearTimeout(readyTimeoutId);
    };
  }, [editor, isEditorReady]);

  // Paste handler
  useEffect(() => {
    if (!editor) return;

    const handlePaste = (event) => {
      const editorElement = document.querySelector(".ProseMirror");
      if (!editorElement || !event.target.closest(".ProseMirror")) return;
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [editor]);

  // Calculate word and character counts
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
    setTextColor,
    addLink,
    handleSaveContent,
    id,
    retryCount,
    setRetryCount,
    setCurrentNote,
    refreshCurrentNote,
    setIsEditorReady,
  };
}
