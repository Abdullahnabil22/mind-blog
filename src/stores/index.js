/**
 * @file Central export file for all Zustand stores
 *
 * This file exports all store hooks used throughout the application.
 * It also defines the settings store which persists user preferences.
 */

import { useAuthStore } from "./useAuthStore";
import { useNotesStore } from "./useNotesStore";
import { useFoldersStore } from "./useFoldersStore";
import { useTagsStore } from "./useTagsStore";
import { useSearchStore } from "./useSearchStore";
import { useKnowledgeGraphStore } from "./useKnowledgeGraphStore";
import { useSettingsStore } from "./useSettingsStore";

export {
  useAuthStore,
  useNotesStore,
  useFoldersStore,
  useTagsStore,
  useSearchStore,
  useKnowledgeGraphStore,
  useSettingsStore,
};
