import { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useNotes } from "../../../../stores/useNotesStore";

export const CreateNoteDialog = ({ isOpen, onOpenChange, parentFolderId, onSuccess }) => {
    const { theme } = useTheme();
    const isDark = theme !== "light";
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className={
            isDark ? "bg-[#00170C] text-amber-100 border-gray-800" : ""
          }
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-amber-100" : ""}>
              Create New Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label
                htmlFor="note-title"
                className={isDark ? "text-amber-100" : ""}
              >
                Note Title
              </Label>
              <Input
                id="note-title"
                value={newNoteName}
                onChange={(e) => setNewNoteName(e.target.value)}
                placeholder="Enter note title"
                className={
                  isDark ? "bg-[#000e07] text-amber-100 border-gray-700" : ""
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={
                isDark ? "text-amber-100 border-gray-700 hover:bg-gray-800" : ""
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNote}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };