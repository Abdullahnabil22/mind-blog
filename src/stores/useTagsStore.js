/**
 * @file Tags store and hook
 * 
 * This file provides tags state management using Zustand
 * combined with React Query for efficient data fetching and caching.
 * 
 * @example
 * // Using the tags hook in a tag management component
 * import { useTags } from '../stores/useTagsStore';
 * import { useState } from 'react';
 * 
 * function TagManager() {
 *   const { tags, isLoading, createTag, updateTag, deleteTag } = useTags();
 *   const [newTagName, setNewTagName] = useState('');
 *   const [newTagColor, setNewTagColor] = useState('#3B82F6');
 *   const [editingTag, setEditingTag] = useState(null);
 *   
 *   const handleCreateTag = () => {
 *     if (newTagName.trim()) {
 *       createTag({ 
 *         name: newTagName, 
 *         color: newTagColor 
 *       });
 *       setNewTagName('');
 *     }
 *   };
 *   
 *   const handleUpdateTag = () => {
 *     if (editingTag && newTagName.trim()) {
 *       updateTag({
 *         id: editingTag.id,
 *         name: newTagName,
 *         color: newTagColor
 *       });
 *       setEditingTag(null);
 *       setNewTagName('');
 *     }
 *   };
 *   
 *   const startEditing = (tag) => {
 *     setEditingTag(tag);
 *     setNewTagName(tag.name);
 *     setNewTagColor(tag.color);
 *   };
 *   
 *   if (isLoading) return <div>Loading tags...</div>;
 *   
 *   return (
 *     <div>
 *       <h2>Tags</h2>
 *       <div className="tag-list">
 *         {tags.map(tag => (
 *           <div key={tag.id} className="tag-item">
 *             <span 
 *               className="tag-badge"
 *               style={{ backgroundColor: tag.color }}
 *             >
 *               {tag.name}
 *             </span>
 *             <button onClick={() => startEditing(tag)}>Edit</button>
 *             <button onClick={() => deleteTag(tag.id)}>Delete</button>
 *           </div>
 *         ))}
 *       </div>
 *       
 *       <div className="tag-form">
 *         <input
 *           value={newTagName}
 *           onChange={(e) => setNewTagName(e.target.value)}
 *           placeholder="Tag name"
 *         />
 *         <input
 *           type="color"
 *           value={newTagColor}
 *           onChange={(e) => setNewTagColor(e.target.value)}
 *         />
 *         
 *         {editingTag ? (
 *           <button onClick={handleUpdateTag}>Update Tag</button>
 *         ) : (
 *           <button onClick={handleCreateTag}>Create Tag</button>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Using tags in a note editor component
 * function TagSelector({ selectedTags, onChange }) {
 *   const { tags } = useTags();
 *   
 *   const toggleTag = (tagId) => {
 *     const newSelection = selectedTags.includes(tagId)
 *       ? selectedTags.filter(id => id !== tagId)
 *       : [...selectedTags, tagId];
 *       
 *     onChange(newSelection);
 *   };
 *   
 *   return (
 *     <div className="tag-selector">
 *       <h4>Tags</h4>
 *       <div className="tags">
 *         {tags.map(tag => (
 *           <button
 *             key={tag.id}
 *             className={selectedTags.includes(tag.id) ? 'selected' : ''}
 *             style={{
 *               backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
 *               color: selectedTags.includes(tag.id) ? 'white' : 'black',
 *               border: `1px solid ${tag.color}`
 *             }}
 *             onClick={() => toggleTag(tag.id)}
 *           >
 *             {tag.name}
 *           </button>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryConfig, defaultMutationOptions } from '../utils/queryConfig';

/**
 * Base Zustand store for tags UI state
 * 
 * @typedef {Object} TagsState
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} setLoading - Set loading state
 * @property {function} setError - Set error state
 */

// Base Zustand store for UI state
export const useTagsStore = create((set) => ({
  isLoading: false,
  error: null,
  
  // Actions that don't need React Query
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// React Query + Zustand combined hook
export function useTags() {
  const { isLoading: storeLoading, error: storeError } = useTagsStore();
  const queryClient = useQueryClient();
  
  // Fetch tags with React Query
  const { 
    data: tags = [], 
    isLoading: queryLoading,
    error: queryError 
  } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    ...defaultQueryConfig()
  });
  
  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async ({ name, color = '#3B82F6' }) => {
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name,
          color
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    ...defaultMutationOptions(queryClient, ['tags'])
  });
  
  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: async ({ id, name, color }) => {
      const { error } = await supabase
        .from('tags')
        .update({
          name,
          color
        })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    ...defaultMutationOptions(queryClient, ['tags'])
  });
  
  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    ...defaultMutationOptions(queryClient, [['tags'], ['notes']])
  });
  
  return {
    tags,
    isLoading: storeLoading || queryLoading || 
               createTagMutation.isLoading || 
               updateTagMutation.isLoading || 
               deleteTagMutation.isLoading,
    error: storeError || queryError || 
           createTagMutation.error || 
           updateTagMutation.error || 
           deleteTagMutation.error,
    createTag: createTagMutation.mutate,
    updateTag: updateTagMutation.mutate,
    deleteTag: deleteTagMutation.mutate,
    refreshTags: () => queryClient.invalidateQueries(['tags']),
  };
}

/**
 * Custom hook that combines Zustand with React Query for tags management
 * 
 * @returns {Object} Tags state and actions
 * @property {Array} tags - List of tags
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} createTag - Create a new tag
 * @property {function} updateTag - Update an existing tag
 * @property {function} deleteTag - Delete a tag
 * @property {function} refreshTags - Refresh tags data
 */ 