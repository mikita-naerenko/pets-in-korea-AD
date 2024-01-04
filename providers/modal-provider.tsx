"use client";

import { useEffect, useState } from "react";

import { TagModal } from "@/components/modals/tag-modal";
import MoveToTrashModal from "@/components/modals/move-to-trash-modal";
import RecoveryItemModal from "@/components/modals/recovery-item-modal";
import CreateNewThemeModal from "@/components/modals/create-new-theme-modal";
import EditDictionaryModal from "@/components/modals/edit-dictionary-modal";
import AddTranslateModal from "@/components/modals/add-translate-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateNewThemeModal />
      <MoveToTrashModal />
      <TagModal />
      <RecoveryItemModal />
      <EditDictionaryModal />
      <AddTranslateModal />
    </>
  );
};
