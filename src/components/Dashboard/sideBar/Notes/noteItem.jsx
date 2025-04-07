import { useState } from "react";
import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";
import { Button } from "../../../ui/button";
import { useNotes } from "../../../../stores/useNotesStore";
import { ConfirmationDialog } from "../../../reusable/confirmationDialog";
import { RenameDialog } from "../../../reusable/renameDialog";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { OptionsMenu } from "../../../reusable/optionsMenu";


export const NoteItem = ({ note, level = 0 }) => {
  const { isDark } = useTheme();
  const paddingLeft = `${level * 2 + 6}px`;
  const [showOptions, setShowOptions] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState(note.title);
  const { updateNote, deleteNote } = useNotes();
  const navigate = useNavigate();

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
      // Navigate away if we're on the deleted note's page
      navigate("/workspace");
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
        // Navigate to the note editor
        navigate(`/workspace/${note.id}`);
      }}
    >
      <div className="w-4 mr-1" />
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
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
        >
          <MoreVertical className="h-3 w-3" />
        </Button>

        <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
          <button
            className={`flex items-center w-full px-3 py-2 text-sm cursor-pointer ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setShowOptions(false);
              setIsRenameDialogOpen(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5 mr-2" />
            <span>Rename</span>
          </button>
          <button
            className={`flex items-center w-full px-3 py-2 text-sm text-red-500 cursor-pointer ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setShowOptions(false);
              setIsDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            <span>Delete</span>
          </button>
        </OptionsMenu>
      </div>
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
