/**
 * @file Folders store and hook
 * 
 * This file provides folder state management using Zustand
 * combined with React Query for efficient data fetching and caching.
 * 
 * @example
 * // Using the folders hook to display a folder list
 * import { useFolders } from '../stores/useFoldersStore';
 * 
 * function FolderList() {
 *   const { folders, isLoading, error, createFolder } = useFolders();
 *   const [newFolderName, setNewFolderName] = useState('');
 *   
 *   const handleCreateFolder = () => {
 *     if (newFolderName.trim()) {
 *       createFolder({ name: newFolderName });
 *       setNewFolderName('');
 *     }
 *   };
 *   
 *   if (isLoading) return <div>Loading folders...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       <h2>Folders</h2>
 *       <ul>
 *         {folders.map(folder => (
 *           <li key={folder.id}>{folder.name}</li>
 *         ))}
 *       </ul>
 *       
 *       <div>
 *         <input
 *           value={newFolderName}
 *           onChange={(e) => setNewFolderName(e.target.value)}
 *           placeholder="New folder name"
 *         />
 *         <button onClick={handleCreateFolder}>Create Folder</button>
 *       </div>
 *     </div>
 *   );
 * }
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../stores/useAuthStore';

/**
 * Base Zustand store for folders UI state
 * 
 * @typedef {Object} FoldersState
 * @property {Array} folders - List of folders
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} setLoading - Set loading state
 * @property {function} setError - Set error state
 * @property {function} fetchFolders - Fetch all folders
 * @property {function} createFolder - Create a new folder
 * @property {function} updateFolder - Update an existing folder
 * @property {function} deleteFolder - Delete a folder
 */

// Base Zustand store for UI state and actions
export const useFoldersStore = create((set, get) => ({
  // State
  folders: [],
  isLoading: false,
  error: null,
  
  // Actions that don't need React Query
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Actions
  fetchFolders: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ folders: data, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  
  createFolder: async ({ name, parentId = null }) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert([{
          name,
          parent_id: parentId
        }])
        .select();
      
      if (error) throw error;
      
      // Refresh folders
      get().fetchFolders();
      set({ isLoading: false });
      
      return data[0];
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },
  
  updateFolder: async ({ id, name, parentId }) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('folders')
        .update({
          name,
          parent_id: parentId
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh folders
      get().fetchFolders();
      set({ isLoading: false });
      
      return id;
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },
  
  deleteFolder: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update folders list
      const updatedFolders = get().folders.filter(folder => folder.id !== id);
      set({ folders: updatedFolders, isLoading: false });
      
      return id;
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  }
}));

/**
 * Custom hook that combines Zustand with React Query for folders management
 * 
 * @returns {Object} Folders state and actions
 * @property {Array} folders - List of folders
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} createFolder - Create a new folder
 * @property {function} updateFolder - Update an existing folder
 * @property {function} deleteFolder - Delete a folder
 * @property {function} refreshFolders - Refresh folders data
 */

// React Query + Zustand combined hook
export function useFolders() {
  const { 
    foldersLoading: storeLoading,
    error: storeError,
  } = useFoldersStore();
  const queryClient = useQueryClient();
  
  // Add this line to get the current user
  const { user } = useAuth();
  
  // This part is already updated to use object syntax - good
  const { 
    data: folders = [], 
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // This part is already updated - good
  const createFolderMutation = useMutation({
    mutationFn: async (folderData) => {
      const { data, error } = await supabase
        .from('folders')
        .insert([{
          name: folderData.name,
          parent_id: folderData.parent_id || null,
          user_id: user.id  // Use the user from the auth store
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
  
  // UPDATE this mutation to use object syntax
  const updateFolderMutation = useMutation({
    mutationFn: async ({ id, name, parentId }) => {
      const { error } = await supabase
        .from('folders')
        .update({
          name,
          parent_id: parentId
        })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
  
  // UPDATE this mutation to use object syntax
  const deleteFolderMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
  
  return {
    folders,
    isLoading: storeLoading || queryLoading,
    error: storeError || queryError,
    createFolder: createFolderMutation.mutate,
    updateFolder: updateFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    refreshFolders: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  };
} 