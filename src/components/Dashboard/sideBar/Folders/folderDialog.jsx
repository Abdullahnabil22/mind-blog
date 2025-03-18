import { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";
import { useFolders } from "../../../../stores/useFoldersStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import toast from "react-hot-toast";
import { Button } from "../../../ui/button";
export const CreateFolderDialog = ({
  isOpen,
  onOpenChange,
  parentId,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const [newFolderName, setNewFolderName] = useState("");
  const { createFolder } = useFolders();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    try {
      await createFolder({
        name: newFolderName,
        parent_id: parentId,
      });
      setNewFolderName("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
      toast.success("Folder created successfully!");
    } catch (error) {
      toast.error("Error creating folder: " + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={isDark ? "bg-[#00170C] text-amber-100 border-gray-800" : ""}
      >
        <DialogHeader>
          <DialogTitle className={isDark ? "text-amber-100" : ""}>
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="folder-name"
              className={isDark ? "text-amber-100" : ""}
            >
              Folder Name
            </Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
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
            onClick={handleCreateFolder}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
