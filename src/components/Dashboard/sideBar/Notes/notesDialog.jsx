import { useState } from "react";
import toast from "react-hot-toast";
import { useNotes } from "../../../../stores/useNotesStore";
import { CreateDialog } from "../../../reusable/createDialog";

export const CreateNoteDialog = ({
  isOpen,
  onOpenChange,
  parentFolderId,
  onSuccess,
}) => {
  const [newNoteName, setNewNoteName] = useState("");
  const { createNote } = useNotes();

  const handleCreateNote = async () => {
    if (!newNoteName.trim()) {
      toast.error("Note title cannot be empty");
      return;
    }

    try {
      await createNote({
        title: newNoteName,
        folder_id: parentFolderId,
        content: {},
        markdown: "",
      });
      setNewNoteName("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
      toast.success("Note created successfully!");
    } catch (error) {
      toast.error("Error creating note: " + error.message);
    }
  };

  return (
    <>
      <CreateDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        newContentName={newNoteName}
        setNewContentName={setNewNoteName}
        handleCreateContent={handleCreateNote}
        title={"Note"}
      />
    </>
  );
};
