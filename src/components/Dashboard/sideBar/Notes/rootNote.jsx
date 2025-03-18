
import { useNotes } from "../../../../stores/useNotesStore";
import { NoteItem } from "./noteItem";

export function Notes({ parentFolderId = null }) {
    const { notes, isLoading: notesLoading } = useNotes();
  
    // Get root-level notes (notes without a folder)
    const rootNotes = !notesLoading 
      ? notes?.filter(note => !note.folder_id && (parentFolderId === null))
      : [];
  
    return (
      <>
        {/* Render notes without a folder (at root level) if no parentFolderId */}
        {parentFolderId === null && rootNotes?.length > 0 &&
          rootNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
      </>
    );
  }
  