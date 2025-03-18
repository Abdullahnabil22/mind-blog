import { FolderPlus } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";
import { Button } from "../../../ui/button";
import { CreateFolderDialog } from "./folderDialog";
import { useState } from "react";

export const FoldersHeader = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`w-5 h-5 ${
        isDark
          ? "text-amber-100 hover:bg-gray-800"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => setIsCreateFolderOpen(true)}
    >
      <FolderPlus className="w-4 h-4" />
      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        parentId={null}
      />
    </Button>
  );
};
