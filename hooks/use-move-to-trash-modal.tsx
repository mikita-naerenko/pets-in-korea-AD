import { create } from "zustand";

interface UseMoveToTrashModal {
  isOpen: boolean;
  item: Item | "";
  setItem: (item: Item | "") => void;
  onOpen: () => void;
  onClose: () => void;
}

interface Item {
  itemId: string;
  itemName: string;
  typeOfItem: string;
}

export const useMoveToTrashModal = create<UseMoveToTrashModal>((set) => ({
  isOpen: false,
  item: "",
  setItem: (item) => set({ item: item }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
