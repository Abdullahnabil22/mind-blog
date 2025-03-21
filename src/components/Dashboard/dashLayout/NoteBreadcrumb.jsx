import { useParams } from "react-router";
import { useNotes } from "../../../stores/useNotesStore";
import { ChevronRight } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export function NotePathBreadcrumb() {
  const { id } = useParams();
  const { isDark } = useTheme();
  // We're only reading from the store, not setting anything
  const { currentNote, isLoading } = useNotes();

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className={`text-sm italic ${
          isDark ? "text-amber-200/70" : "text-gray-500"
        }`}
      >
        Loading...
      </div>
    );
  }

  // Handle missing note
  if (!id || !currentNote) {
    return (
      <div
        className={`text-sm italic ${
          isDark ? "text-amber-200/70" : "text-gray-500"
        }`}
      >
        No note selected
      </div>
    );
  }

  const folderName = currentNote?.folder?.name || "Unfiled";

  return (
    <div className="flex items-center text-sm">
      <span className={isDark ? "text-amber-300" : "text-gray-600"}>
        {folderName}
      </span>
      <ChevronRight className="w-4 h-4 mx-1" />
      <span
        className={`font-medium ${isDark ? "text-amber-100" : "text-gray-900"}`}
      >
        {currentNote.title}
      </span>
    </div>
  );
}
