import { useNotes } from "../../../../stores/useNotesStore";
import { NoteItem } from "./noteItem";

export function Notes({ parentFolderId = null }) {
  const { notes, isLoading: notesLoading } = useNotes();

  const rootNotes = !notesLoading
    ? notes?.filter((note) => !note.folder_id && parentFolderId === null)
    : [];

  return (
    <>
      {parentFolderId === null &&
        rootNotes?.length > 0 &&
        rootNotes.map((note) => <NoteItem key={note.id} note={note} />)}
    </>
  );
}
