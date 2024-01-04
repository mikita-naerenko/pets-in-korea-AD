import { create } from "zustand";

interface useModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface useModalEdit {
  isOpen: boolean;
  item:
    | {
        type: string;
        id: string;
        content: {
          phrase?: string;
          translate?: string;
          transcription?: string;
        };
      }
    | "";
  onOpen: () => void;
  onClose: () => void;
  setItem: (
    item:
      | {
          type: string;
          id: string;
          content: {
            phrase?: string;
            translate?: string;
            transcription?: string;
          };
        }
      | ""
  ) => void;
}

interface UseAddTranslateModal {
  isOpen: boolean;
  item:
    | {
        type: string;
        phraseId: string;
        theme: string;
      }
    | "";
  onOpen: () => void;
  onClose: () => void;
  setItem: (
    item:
      | {
          type: string;
          phraseId: string;
          theme: string;
        }
      | ""
  ) => void;
}

export const useTagModal = create<useModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useThemeModal = create<useModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useModalEdit = create<useModalEdit>((set) => ({
  isOpen: false,
  item: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setItem: (item) => set({ item: item }),
}));

export const useAddTranslateModal = create<UseAddTranslateModal>((set) => ({
  item: "",
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setItem: (item) => set({ item: item }),
}));
