/**
 * @file Search store and hook
 *
 * This file provides search state management using Zustand
 * combined with React Query for efficient data fetching and filtering.
 *
 * @example
 * // Using the search hook in a search component
 * import { useSearch } from '../stores/useSearchStore';
 * import { useTags } from '../stores/useTagsStore';
 * import { useFolders } from '../stores/useFoldersStore';
 *
 * function SearchComponent() {
 *   const {
 *     searchQuery,
 *     setSearchQuery,
 *     filters,
 *     setFilters,
 *     results,
 *     isLoading,
 *     search,
 *     clearSearch
 *   } = useSearch();
 *   const { tags } = useTags();
 *   const { folders } = useFolders();
 *
 *   const handleSearch = (e) => {
 *     e.preventDefault();
 *     search();
 *   };
 *
 *   const handleTagFilter = (tagId) => {
 *     const newTagFilters = filters.tags.includes(tagId)
 *       ? filters.tags.filter(id => id !== tagId)
 *       : [...filters.tags, tagId];
 *
 *     setFilters({
 *       ...filters,
 *       tags: newTagFilters
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <form onSubmit={handleSearch}>
 *         <input
 *           type="text"
 *           value={searchQuery}
 *           onChange={(e) => setSearchQuery(e.target.value)}
 *           placeholder="Search notes..."
 *         />
 *         <button type="submit">Search</button>
 *         <button type="button" onClick={clearSearch}>Clear</button>
 *       </form>
 *
 *       <div className="filters">
 *         <h4>Filter by tags:</h4>
 *         <div className="tag-filters">
 *           {tags.map(tag => (
 *             <button
 *               key={tag.id}
 *               style={{
 *                 backgroundColor: filters.tags.includes(tag.id) ? tag.color : 'transparent',
 *                 color: filters.tags.includes(tag.id) ? 'white' : 'black',
 *                 border: `1px solid ${tag.color}`
 *               }}
 *               onClick={() => handleTagFilter(tag.id)}
 *             >
 *               {tag.name}
 *             </button>
 *           ))}
 *         </div>
 *       </div>
 *
 *       {isLoading ? (
 *         <div>Searching...</div>
 *       ) : (
 *         <div className="search-results">
 *           <h3>Results ({results.length})</h3>
 *           {results.map(note => (
 *             <div key={note.id} className="search-result">
 *               <h4>{note.title}</h4>
 *               <p>{note.content.substring(0, 100)}...</p>
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */

import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { sessionQueryConfig } from "../lib/queryConfig";

/**
 * Base Zustand store for search state
 *
 * @typedef {Object} SearchState
 * @property {string} searchQuery - Current search text
 * @property {Object} filters - Applied search filters
 * @property {Array} filters.folders - Folder IDs to filter by
 * @property {Array} filters.tags - Tag IDs to filter by
 * @property {Object|null} filters.dateRange - Date range to filter by
 * @property {function} setSearchQuery - Set search query text
 * @property {function} setFilters - Set search filters
 * @property {function} hasActiveFilters - Check if any filters are active
 * @property {function} clearSearch - Clear search query and filters
 */

// Base Zustand store for search state
export const useSearchStore = create((set, get) => ({
  searchQuery: "",
  filters: {
    folders: [],
    tags: [],
    dateRange: null,
  },

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (filters) => set({ filters }),

  hasActiveFilters: () => {
    const { filters } = get();
    return (
      (filters.folders && filters.folders.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      (filters.dateRange && (filters.dateRange.from || filters.dateRange.to))
    );
  },

  clearSearch: () =>
    set({
      searchQuery: "",
      filters: {
        folders: [],
        tags: [],
        dateRange: null,
      },
    }),
}));

/**
 * Custom hook that combines Zustand with React Query for search functionality
 *
 * @returns {Object} Search state and actions
 * @property {string} searchQuery - Current search text
 * @property {Object} filters - Applied search filters
 * @property {Array} results - Search results
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} setSearchQuery - Set search query text
 * @property {function} setFilters - Set search filters
 * @property {function} search - Execute the search
 * @property {function} hasActiveFilters - Check if any filters are active
 * @property {function} clearSearch - Clear search query and filters
 */

// React Query + Zustand combined hook
export function useSearch() {
  const {
    searchQuery,
    filters,
    hasActiveFilters,
    setSearchQuery,
    setFilters,
    clearSearch,
  } = useSearchStore();

  // Search with React Query
  const {
    data: results = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["search", searchQuery, filters],
    queryFn: async () => {
      if (!searchQuery && !hasActiveFilters()) {
        return [];
      }

      let query = supabase.from("notes").select(`
          *,
          folder:folders(id, name),
          tags:note_tags(tags(*))
        `);

      // Text search
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%, markdown.ilike.%${searchQuery}%`
        );
      }

      // Filter by folders
      if (filters.folders?.length > 0) {
        query = query.in("folder_id", filters.folders);
      }

      // Filter by date range
      if (filters.dateRange?.from) {
        query = query.gte("created_at", filters.dateRange.from);
      }
      if (filters.dateRange?.to) {
        query = query.lte("created_at", filters.dateRange.to);
      }

      // Get the results
      let { data, error } = await query;

      if (error) throw error;

      // Handle tag filtering client-side (due to RLS limitations)
      if (filters.tags?.length > 0) {
        data = data.filter((note) => {
          const noteTags = note.tags.map((t) => t.tags.id);
          return filters.tags.some((tagId) => noteTags.includes(tagId));
        });
      }

      // Format the result
      return data.map((note) => ({
        ...note,
        folder: note.folder,
        tags: note.tags.map((t) => t.tags),
      }));
    },
    enabled: searchQuery !== "" || hasActiveFilters(),
    ...sessionQueryConfig(),
  });

  const search = () => {
    refetch();
  };

  return {
    searchQuery,
    filters,
    results,
    isLoading,
    error,
    setSearchQuery,
    setFilters,
    search,
    hasActiveFilters,
    clearSearch,
  };
}
