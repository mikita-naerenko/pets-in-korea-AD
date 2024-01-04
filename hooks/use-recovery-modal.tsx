import { create } from "zustand";

interface UseRecoveryModal {
  isOpen: boolean;
  item: string | "";
  setItem: (item: string | "") => void;
  onOpen: () => void;
  onClose: () => void;
}

export const useRecoveryModal = create<UseRecoveryModal>((set) => ({
  isOpen: false,
  item: "",
  setItem: (item) => set({ item: item }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
