import { useState } from "react";
import { useFolders } from "../../../../stores/useFoldersStore";
import toast from "react-hot-toast";
import { CreateDialog } from "../../../reusable/createDialog";
export const CreateFolderDialog = ({
  isOpen,
  onOpenChange,
  parentId,
  onSuccess,
}) => {
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
    <>
      <CreateDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        newContentName={newFolderName}
        setNewContentName={setNewFolderName}
        handleCreateContent={handleCreateFolder}
        title={"Folder"}
      />
    </>
  );
};
