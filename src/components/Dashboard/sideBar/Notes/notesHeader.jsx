import { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";
import { Button } from "../../../ui/button";
import { CreateNoteDialog } from "./notesDialog";
import { FilePlus } from "lucide-react";

export const NotesHeader = () => {
    const { theme } = useTheme();
    const isDark = theme !== "light";
    const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={`w-5 h-5 ${
            isDark
              ? "text-amber-100 hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setIsCreateNoteOpen(true)}
        >
          <FilePlus className="w-4 h-4" />
        </Button>
        
        <CreateNoteDialog 
          isOpen={isCreateNoteOpen} 
          onOpenChange={setIsCreateNoteOpen} 
          parentFolderId={null} 
        />
      </>
    );
  };