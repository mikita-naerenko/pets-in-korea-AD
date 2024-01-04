import { create } from "zustand";

interface useSelectedTags {
  selected: string[];
  onSelected: (id: string) => void;
  onRemoved: (id: string) => void;
}

export const useSelectedTagsState = create<useSelectedTags>((set) => ({
  selected: [],
  onSelected: (id) =>
    set((state) => ({
      selected: [...state.selected, id],
    })),
  onRemoved: (id) =>
    set((state) => ({
      selected: state.selected.filter((tagId) => tagId !== id),
    })),
}));
