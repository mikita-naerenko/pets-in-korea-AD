import { create } from "zustand";

interface useSelected {
  selected: string;
  onSelected: (id: string) => void;
}

export const useSortByDate = create<useSelected>((set) => ({
  selected: "SortDownCreate",
  onSelected: (id) => set({ selected: id }),
}));
