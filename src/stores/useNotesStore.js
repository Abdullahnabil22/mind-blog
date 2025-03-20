/**
 * @file Notes store and hook
 * 
 * This file provides notes state management using Zustand
 * combined with React Query for efficient data fetching and caching.
 * 
 * @example
 * // Using the notes hook to display a note list and editor
 * import { useNotes } from '../stores/useNotesStore';
 * import { useState } from 'react';
 * 
 * function NotesApp() {
 *   const { 
 *     notes, 
 *     currentNote, 
 *     isLoading, 
 *     setCurrentNote, 
 *     updateNote 
 *   } = useNotes();
 *   const [editedContent, setEditedContent] = useState('');
 *   
 *   // Set up editor when a note is selected
 *   useEffect(() => {
 *     if (currentNote) {
 *       setEditedContent(currentNote.markdown);
 *     }
 *   }, [currentNote]);
 *   
 *   const handleSave = () => {
 *     if (currentNote) {
 *       updateNote({
 *         id: currentNote.id,
 *         title: currentNote.title,
 *         markdown: editedContent,
 *         content: editedContent, // You might want to process markdown here
 *         folderId: currentNote.folder_id,
 *         tags: currentNote.tags.map(tag => tag.id)
 *       });
 *     }
 *   };
 *   
 *   if (isLoading) return <div>Loading notes...</div>;
 *   
 *   return (
 *     <div className="notes-app">
 *       <div className="notes-list">
 *         {notes.map(note => (
 *           <div 
 *             key={note.id} 
 *             className={note.id === currentNote?.id ? 'selected' : ''}
 *             onClick={() => setCurrentNote(note.id)}
 *           >
 *             {note.title}
 *           </div>
 *         ))}
 *       </div>
 *       
 *       {currentNote && (
 *         <div className="note-editor">
 *           <h2>{currentNote.title}</h2>
 *           <textarea
 *             value={editedContent}
 *             onChange={(e) => setEditedContent(e.target.value)}
 *           />
 *           <button onClick={handleSave}>Save</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Using the notes hook with folder filtering
 * function FolderNotes({ folderId }) {
 *   const { notes, isLoading } = useNotes(folderId);
 *   
 *   if (isLoading) return <div>Loading notes...</div>;
 *   
 *   return (
 *     <div>
 *       <h3>Notes in this folder</h3>
 *       {notes.length === 0 ? (
 *         <p>No notes in this folder</p>
 *       ) : (
 *         <ul>
 *           {notes.map(note => (
 *             <li key={note.id}>{note.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../stores/useAuthStore';
import { defaultQueryConfig, sessionQueryConfig, defaultMutationOptions } from '../utils/queryConfig';

/**
 * Base Zustand store for notes UI state
 * 
 * @typedef {Object} NotesState
 * @property {string|null} currentNoteId - ID of the currently selected note
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} setCurrentNoteId - Set the current note ID
 * @property {function} setLoading - Set loading state
 * @property {function} setError - Set error state
 * @property {function} clearCurrentNote - Clear the current note selection
 */

// Base Zustand store for UI state
export const useNotesStore = create((set) => ({
  currentNoteId: null,
  isLoading: false,
  error: null,
  
  // Actions that don't need React Query
  setCurrentNoteId: (id) => set({ currentNoteId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearCurrentNote: () => set({ currentNoteId: null }),
}));

/**
 * Custom hook that combines Zustand with React Query for notes management
 * 
 * @param {string|null} folderId - Optional folder ID to filter notes
 * @param {string|null} tagId - Optional tag ID to filter notes
 * @returns {Object} Notes state and actions
 * @property {Array} notes - List of notes
 * @property {Object|null} currentNote - Currently selected note with full details
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} setCurrentNote - Set the current note
 * @property {function} clearCurrentNote - Clear the current note selection
 * @property {function} createNote - Create a new note
 * @property {function} updateNote - Update an existing note
 * @property {function} deleteNote - Delete a note
 * @property {function} refreshNotes - Refresh notes data
 * @property {function} refreshCurrentNote - Refresh current note data
 */

// React Query + Zustand combined hook
export function useNotes(folderId = null, tagId = null) {
  const { 
    currentNoteId, 
    isLoading: storeLoading, 
    error: storeError, 
    setCurrentNoteId,
    clearCurrentNote
  } = useNotesStore();
  const queryClient = useQueryClient();
  
  // Get current user from auth store
  const { user } = useAuth();
  
  // Update to use object syntax
  const { 
    data: notes = [], 
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['notes', folderId, tagId],
    queryFn: async () => {
      let query = supabase
        .from('notes')
        .select(`
          *,
          folder:folders(id, name),
          tags:note_tags(tags(*))
        `)
        .order('created_at', { ascending: false });
      
      if (folderId) {
        query = query.eq('folder_id', folderId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If filtering by tag, we need to do it client-side
      // since it's a many-to-many relationship
      if (tagId) {
        return data.filter(note => 
          note.tags.some(t => t.tags.id === tagId)
        );
      }
      
      return data;
    },
    ...defaultQueryConfig()
  });
  
  // Fetch single note with React Query
  const { 
    data: currentNote = null, 
    isLoading: currentNoteLoading,
    error: currentNoteError 
  } = useQuery({
    queryKey: ['note', currentNoteId],
    queryFn: async () => {
      if (!currentNoteId) return null;
      
      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          *,
          folder:folders(id, name),
          tags:note_tags(tags(*)),
          links:note_links(
            id,
            target_note_id,
            link_type,
            target:notes!note_links_target_note_id_fkey(id, title)
          )
        `
        )
        .eq("id", currentNoteId)
        .single();

      if (error) throw error;

      return {
        ...data,
        tags: data.tags.map((t) => t.tags),
        links: data.links.map((l) => ({
          id: l.id,
          targetNoteId: l.target_note_id,
          linkType: l.link_type,
          targetNote: l.target,
        })),
      };
    },
    enabled: !!currentNoteId,
    ...sessionQueryConfig()
  });
  
  // Update createNote mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: noteData.title,
          content: noteData.content || {},
          markdown: noteData.markdown || '',
          folder_id: noteData.folder_id,
          user_id: user.id
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    ...defaultMutationOptions(queryClient, ['notes'])
  });
  
  // Update updateNote mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: noteData.title,
          content: noteData.content,
          markdown: noteData.markdown,
          folder_id: noteData.folder_id
        })
        .eq('id', noteData.id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    ...defaultMutationOptions(queryClient, [
      ['notes'], 
      ['note', currentNoteId]
    ])
  });
  
  // Update deleteNote mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Clear current note if it was deleted
      if (currentNoteId === id) {
        clearCurrentNote();
      }
      
      return id;
    },
    ...defaultMutationOptions(queryClient, ['notes'])
  });
  
  // Update addTag mutation
  const addTagMutation = useMutation({
    mutationFn: async ({ noteId, tagId }) => {
      const { data, error } = await supabase
        .from('note_tags')
        .insert([{
          note_id: noteId,
          tag_id: tagId
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    ...defaultMutationOptions(queryClient, [
      ['notes'],
      ['note', currentNoteId]
    ])
  });
  
  // Update removeTag mutation
  const removeTagMutation = useMutation({
    mutationFn: async ({ noteId, tagId }) => {
      const { error } = await supabase
        .from('note_tags')
        .delete()
        .match({ note_id: noteId, tag_id: tagId });
      
      if (error) throw error;
      return { noteId, tagId };
    },
    ...defaultMutationOptions(queryClient, [
      ['notes'],
      ['note', currentNoteId]
    ])
  });
  
  return {
    notes,
    currentNote,
    isLoading: storeLoading || queryLoading || currentNoteLoading,
    error: storeError || queryError || currentNoteError,
    setCurrentNote: setCurrentNoteId,
    clearCurrentNote,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    addTag: addTagMutation.mutate,
    removeTag: removeTagMutation.mutate,
    refreshNotes: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    refreshCurrentNote: () => currentNoteId && queryClient.invalidateQueries({ queryKey: ['note', currentNoteId] }),
  };
} 