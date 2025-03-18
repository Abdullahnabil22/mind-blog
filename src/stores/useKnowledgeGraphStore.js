/**
 * @file Knowledge Graph store and hook
 * 
 * This file provides knowledge graph state management using Zustand
 * combined with React Query for efficient data fetching and caching.
 * The knowledge graph represents connections between notes.
 * 
 * @example
 * // Using the knowledge graph hook with a visualization library
 * import { useKnowledgeGraph } from '../stores/useKnowledgeGraphStore';
 * import { Network } from 'vis-network/standalone';
 * import { useRef, useEffect } from 'react';
 * 
 * function KnowledgeGraphVisualization() {
 *   const { graph, isLoading, error, createLink } = useKnowledgeGraph();
 *   const networkRef = useRef(null);
 *   const containerRef = useRef(null);
 *   
 *   useEffect(() => {
 *     if (!isLoading && !error && containerRef.current && graph.nodes.length > 0) {
 *       // Create network visualization
 *       const options = {
 *         nodes: {
 *           shape: 'dot',
 *           size: 16
 *         },
 *         physics: {
 *           stabilization: false
 *         }
 *       };
 *       
 *       networkRef.current = new Network(
 *         containerRef.current,
 *         { nodes: graph.nodes, edges: graph.edges },
 *         options
 *       );
 *       
 *       // Handle node clicks, etc.
 *     }
 *   }, [graph, isLoading, error]);
 *   
 *   if (isLoading) return <div>Loading knowledge graph...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       <h2>Knowledge Graph</h2>
 *       <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
 *     </div>
 *   );
 * }
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Base Zustand store for knowledge graph UI state
 * 
 * @typedef {Object} KnowledgeGraphState
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} setLoading - Set loading state
 * @property {function} setError - Set error state
 */

// Base Zustand store for UI state
export const useKnowledgeGraphStore = create((set) => ({
  isLoading: false,
  error: null,
  
  // Actions that don't need React Query
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// React Query + Zustand combined hook
export function useKnowledgeGraph() {
  const { isLoading: storeLoading, error: storeError } = useKnowledgeGraphStore();
  const queryClient = useQueryClient();
  
  // Fetch graph with React Query
  const { 
    data: graph = { nodes: [], edges: [] }, 
    isLoading: queryLoading,
    error: queryError 
  } = useQuery(
    ['knowledgeGraph'],
    async () => {
      // Get all notes
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('id, title');
      
      if (notesError) throw notesError;
      
      // Get all links
      const { data: links, error: linksError } = await supabase
        .from('note_links')
        .select('id, source_note_id, target_note_id, link_type');
      
      if (linksError) throw linksError;
      
      return {
        nodes: notes.map(note => ({
          id: note.id,
          label: note.title
        })),
        edges: links.map(link => ({
          id: link.id,
          from: link.source_note_id,
          to: link.target_note_id,
          label: link.link_type || '',
          arrows: 'to'
        }))
      };
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Create link mutation
  const createLinkMutation = useMutation(
    async ({ sourceNoteId, targetNoteId, linkType = 'relates to' }) => {
      const { data, error } = await supabase
        .from('note_links')
        .insert([{
          source_note_id: sourceNoteId,
          target_note_id: targetNoteId,
          link_type: linkType
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['knowledgeGraph']);
      }
    }
  );
  
  // Delete link mutation
  const deleteLinkMutation = useMutation(
    async (id) => {
      const { error } = await supabase
        .from('note_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['knowledgeGraph']);
      }
    }
  );
  
  return {
    graph,
    isLoading: storeLoading || queryLoading || 
               createLinkMutation.isLoading || 
               deleteLinkMutation.isLoading,
    error: storeError || queryError || 
           createLinkMutation.error || 
           deleteLinkMutation.error,
    createLink: createLinkMutation.mutate,
    deleteLink: deleteLinkMutation.mutate,
    refreshGraph: () => queryClient.invalidateQueries(['knowledgeGraph']),
  };
}

/**
 * Custom hook that combines Zustand with React Query for knowledge graph management
 * 
 * @returns {Object} Knowledge graph state and actions
 * @property {Object} graph - Graph data with nodes and edges
 * @property {Array} graph.nodes - Note nodes in the graph
 * @property {Array} graph.edges - Connection edges between notes
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error state
 * @property {function} createLink - Create a new link between notes
 * @property {function} deleteLink - Delete a link between notes
 * @property {function} refreshGraph - Refresh graph data
 */ 