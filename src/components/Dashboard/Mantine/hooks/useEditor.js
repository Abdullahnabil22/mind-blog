import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useEditor } from "@tiptap/react";
import { useNotes } from "../../../../stores/useNotesStore";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import ListItem from "@tiptap/extension-list-item";
import TaskItem from "@tiptap/extension-task-item";
import TipTapTaskList from "@tiptap/extension-task-list";
import BulletList from "@tiptap/extension-bullet-list";
import { getTaskListExtension } from "@mantine/tiptap";
import { all, createLowlight } from "lowlight";
import toast from "react-hot-toast";

export function useEditorWithMantine() {
  // State management
  const { id } = useParams();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("enabled");

  // Refs
  const autoSaveTimeout = useRef(null);
  const editorInitTimeout = useRef(null);
  const handleSaveContentRef = useRef(null);
  const contentAlreadySet = useRef(false);
  const lowlight = createLowlight(all);

  // Note data from the store
  const {
    currentNote,
    setCurrentNote,
    updateNote,
    isLoading,
    refreshCurrentNote,
  } = useNotes();

  // State to track retry attempts
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        listItem: false,
        codeBlock: false,
        taskList: false,
        bulletList: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "heading",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "paragraph",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "ordered-list",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      Superscript,
      SubScript,
      Highlight,
      TextStyle,
      Color,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: "Start writing here...",
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "list-item",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "bullet-list",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      getTaskListExtension(TipTapTaskList),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "test-item",
        },
      }),
    ],
    content: "",
    editable: true,
    onUpdate: () => {
      setAutoSaveStatus("pending");
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      if (handleSaveContentRef.current) {
        autoSaveTimeout.current = setTimeout(() => {
          handleSaveContentRef.current(false);
        }, 2000);
      }
    },
    onReady: () => {
      editorInitTimeout.current = setTimeout(() => {
        setIsEditorReady(true);
      }, 100);
    },
  });

  // Calculate word and character counts
  const wordCount = editor
    ? editor
        .getText()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;

  const characterCount = editor ? editor.getText().length : 0;

  // Format the last saved time
  const formatLastSaved = useCallback(() => {
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
  }, [lastSaved]);

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
        toast.error(
          "Failed to save note: " + (error.message || "Unknown error")
        );

        setTimeout(() => {
          setAutoSaveStatus("enabled");
        }, 3000);
      }
    },
    [currentNote, editor, updateNote]
  );

  // Combined effect for initialization and cleanup
  useEffect(() => {
    // Store the save function in the ref for access in other effects
    handleSaveContentRef.current = handleSaveContent;

    // UUID pattern for validation
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidNoteId = id && uuidPattern.test(id);

    // Set current note if ID is valid
    if (isValidNoteId) {
      setCurrentNote(id);
      contentAlreadySet.current = false;
    } else {
      // Reset state for invalid IDs
      setIsEditorReady(true);
      setHasChanges(false);
      setAutoSaveStatus("enabled");
      contentAlreadySet.current = false;
    }

    // Setup page visibility change handler for auto-save
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        hasChanges &&
        handleSaveContentRef.current
      ) {
        handleSaveContentRef.current(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Cleanup timers and event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (editorInitTimeout.current) {
        clearTimeout(editorInitTimeout.current);
      }

      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [id, setCurrentNote, handleSaveContent, hasChanges]);

  // Retry loading note and update editor content when currentNote changes
  useEffect(() => {
    // Handle retries for loading the note
    if (!currentNote && !isLoading) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isValidNoteId = id && uuidPattern.test(id);

      if (isValidNoteId && retryCount < maxRetries) {
        const timer = setTimeout(() => {
          refreshCurrentNote();
          setRetryCount((prev) => prev + 1);
        }, 1000 * (retryCount + 1));

        return () => clearTimeout(timer);
      }
    } else if (currentNote) {
      // Reset retry count when note is loaded
      setRetryCount(0);

      // Update editor content when currentNote changes and editor is available
      if (editor && !contentAlreadySet.current) {
        let noteContent = "";

        if (currentNote.markdown) {
          noteContent = currentNote.markdown;
        } else if (currentNote.content) {
          if (typeof currentNote.content === "object") {
            try {
              noteContent =
                currentNote.content.content ||
                JSON.stringify(currentNote.content);
            } catch (error) {
              noteContent = "";
              toast.error("Error parsing note content: " + error.message);
            }
          } else {
            noteContent = currentNote.content;
          }
        }

        if (noteContent === "{}") {
          noteContent = "";
        }

        editor.commands.setContent(noteContent);
        contentAlreadySet.current = true;
        setHasChanges(false);
        setAutoSaveStatus("enabled");
      }
    }
  }, [
    currentNote,
    editor,
    id,
    isLoading,
    refreshCurrentNote,
    retryCount,
    maxRetries,
  ]);

  return {
    editor,
    currentNote,
    hasChanges,
    isEditorReady,
    isLoading,
    autoSaveStatus,
    wordCount,
    characterCount,
    formatLastSaved,
    handleSaveContent,
    setIsEditorReady,
    setHasChanges,
  };
}
