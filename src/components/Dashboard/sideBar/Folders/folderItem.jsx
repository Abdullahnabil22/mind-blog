import { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";
import { Button } from "../../../ui/button";
import {
  FilePlus,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Folder,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { NoteItem } from "../Notes";
import { useFolders } from "../../../../stores/useFoldersStore";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "../../../reusable/confirmationDialog";
import { RenameDialog } from "../../../reusable/renameDialog";
import { OptionsMenu } from "../../../reusable/optionsMenu";

export const FolderItem = ({
  folder,
  level = 0,
  setSelectedFolderId,
  setIsCreateNoteOpen,
  setIsCreateFolderOpen,
}) => {
  const { isDark } = useTheme();
  const [expandedFolders, setExpandedFolders] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { updateFolder, deleteFolder } = useFolders();
  const isExpanded = expandedFolders[folder.id];
  const paddingLeft = `${level * 2 + 6}px`;

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleRenameFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    try {
      await updateFolder({
        id: folder.id,
        name: folderName,
        parentId: folder.parent_id,
      });
      setIsRenameDialogOpen(false);
      toast.success("Folder renamed successfully!");
    } catch (error) {
      toast.error("Error renaming folder: " + error.message);
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(folder.id);
      setIsDeleteConfirmOpen(false);
      toast.success("Folder deleted successfully!");
    } catch (error) {
      toast.error("Error deleting folder: " + error.message);
    }
  };

  return (
    <div key={folder.id}>
      <div
        className={`flex items-center mt-1 py-1 px-2 rounded-md cursor-pointer ${
          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
        } group relative`}
        style={{ paddingLeft }}
        onClick={() => toggleFolder(folder.id)}
      >
        {folder.children.length > 0 || folder.notes.length > 0 ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )
        ) : (
          <div className="w-4 mr-1" />
        )}
        <Folder
          className={`w-4 h-4 mr-2 ${
            isDark ? "text-amber-100" : "text-gray-700"
          }`}
        />

        <span
          className={`text-sm truncate ${
            isDark ? "text-amber-100" : "text-gray-700"
          }`}
        >
          {folder.name}
        </span>

        <div className="ml-auto flex space-x-1 ">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(folder.id);
              setIsCreateNoteOpen(true);
            }}
          >
            <FilePlus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(folder.id);
              setIsCreateFolderOpen(true);
            }}
          >
            <FolderPlus className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
          >
            <MoreVertical className="w-3 h-3" />
          </Button>

          <OptionsMenu
            isOpen={showOptions}
            onClose={() => setShowOptions(false)}
          >
            <button
              className={`flex items-center w-full px-3 py-2 text-sm cursor-pointer ${
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
              className={`flex items-center w-full px-3 py-2 text-sm text-red-500 cursor-pointer ${
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
          </OptionsMenu>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-4">
          {/* Render child folders */}
          {folder.children.map((childFolder) => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              level={level + 1}
              setSelectedFolderId={setSelectedFolderId}
              setIsCreateNoteOpen={setIsCreateNoteOpen}
              setIsCreateFolderOpen={setIsCreateFolderOpen}
            />
          ))}

          {/* Render notes inside this folder */}
          {folder.notes.map((note) => (
            <NoteItem key={note.id} note={note} level={level + 1} />
          ))}
        </div>
      )}

      {/* Using the reusable rename dialog */}
      <RenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        title="Rename Folder"
        labelText="Folder Name"
        inputId="folder-name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onSave={handleRenameFolder}
      />

      {/* Using the reusable confirmation dialog */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Folder"
        description={
          folder.children.length > 0 || folder.notes.length > 0
            ? `Are you sure you want to delete "${folder.name}"? This will also delete all nested folders and notes.`
            : `Are you sure you want to delete "${folder.name}"?`
        }
        confirmText="Delete"
        onConfirm={handleDeleteFolder}
      />
    </div>
  );
};
