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
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`w-5 h-5 cursor-pointer ${
          isDark
            ? "text-amber-100 hover:bg-amber-100"
            : "text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => setIsCreateFolderOpen(true)}
      >
        <FolderPlus className="h-4 w-4" />
      </Button>
      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        parentId={null}
      />
    </>
  );
};
