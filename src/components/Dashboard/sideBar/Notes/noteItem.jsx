import { useState } from "react";
import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";
import { Button } from "../../../ui/button";
import { useNotes } from "../../../../stores/useNotesStore";
import { ConfirmationDialog } from "../../../reusable/confirmationDialog";
import { RenameDialog } from "../../../reusable/renameDialog";
import toast from "react-hot-toast";

// Component to render a single note
export const NoteItem = ({ note, level = 0 }) => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const paddingLeft = `${level * 12 + 8}px`;
  const [showOptions, setShowOptions] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState(note.title);
  const { updateNote, deleteNote } = useNotes();

  const handleRenameNote = async () => {
    if (!noteTitle.trim()) {
      toast.error("Note title cannot be empty");
      return;
    }

    try {
      await updateNote({
        id: note.id,
        title: noteTitle,
      });
      setIsRenameDialogOpen(false);
      toast.success("Note renamed successfully!");
    } catch (error) {
      toast.error("Error renaming note: " + error.message);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await deleteNote(note.id);
      setIsDeleteConfirmOpen(false);
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Error deleting note: " + error.message);
    }
  };

  return (
    <div
      className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
        isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
      } group relative`}
      style={{ paddingLeft }}
      onClick={() => {
        // Handle note click - e.g., open note editor
        // You can add navigation here later
      }}
    >
      <div className="w-4 mr-1" /> {/* Spacing for alignment */}
      <FileText
        className={`w-4 h-4 mr-2 ${
          isDark ? "text-amber-100" : "text-gray-700"
        }`}
      />
      <span
        className={`text-sm truncate ${
          isDark ? "text-amber-100" : "text-gray-700"
        }`}
      >
        {note.title}
      </span>
      <div className="ml-auto opacity-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
        >
          <MoreVertical className="w-3 h-3" />
        </Button>

        {/* Simple inline menu */}
        {showOptions && (
          <div
            className={`absolute z-50 right-0 top-8 w-36 rounded-md shadow-lg py-1 ${
              isDark
                ? "bg-gray-900 text-amber-100 border border-gray-800"
                : "bg-white border border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`flex items-center w-full px-3 py-2 text-sm ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setShowOptions(false);
                setIsRenameDialogOpen(true);
              }}
            >
              <Pencil className="w-3.5 h-3.5 mr-2" />
              <span>Rename</span>
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm text-red-500 ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setShowOptions(false);
                setIsDeleteConfirmOpen(true);
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      {/* Using the reusable rename dialog */}
      <RenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        title="Rename Note"
        labelText="Note Title"
        inputId="note-title"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        onSave={handleRenameNote}
      />
      {/* Using the reusable confirmation dialog */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Note"
        description={`Are you sure you want to delete "${note.title}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteNote}
      />
    </div>
  );
};
