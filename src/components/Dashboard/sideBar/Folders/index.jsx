import { useFolders } from "../../../../stores/useFoldersStore";
import { useNotes } from "../../../../stores/useNotesStore";
import { useState } from "react";
import { CreateNoteDialog } from "../Notes";
import { CreateFolderDialog } from "./folderDialog";
import { FolderItem } from "./folderItem";
import { FoldersHeader } from "./folderHeader";

function Folders() {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Get folders and notes data
  const { folders, isLoading: foldersLoading } = useFolders();
  const { notes, isLoading: notesLoading } = useNotes();

  // Build nested folder structure with notes
  const buildFolderTree = (items, allNotes, parentId = null) => {
    const folderItems = items
      .filter((item) => item.parent_id === parentId)
      .map((folder) => ({
        ...folder,
        children: buildFolderTree(items, allNotes, folder.id),
        notes: allNotes.filter((note) => note.folder_id === folder.id),
      }));

    return folderItems;
  };

  // Group folders and their notes
  const folderTree =
    foldersLoading || notesLoading ? [] : buildFolderTree(folders, notes);

  // Recursive component to render folders and their children

  return (
    <>
      {foldersLoading || notesLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="px-2 py-1">
          {/* Render folders with their nested items */}
          {folderTree.length > 0 &&
            folderTree.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                setSelectedFolderId={setSelectedFolderId}
                setIsCreateFolderOpen={setIsCreateFolderOpen}
                setIsCreateNoteOpen={setIsCreateNoteOpen}
              />
            ))}

          {/* Show message if no content */}
          {folderTree.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              No folders yet. Create your first folder!
            </div>
          )}
        </div>
      )}

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        parentId={selectedFolderId}
      />

       {/* Create Note Dialog */}
      <CreateNoteDialog
        isOpen={isCreateNoteOpen}
        onOpenChange={setIsCreateNoteOpen}
        parentFolderId={selectedFolderId}
      /> 
    </>
  );
}
export { Folders, FoldersHeader };
