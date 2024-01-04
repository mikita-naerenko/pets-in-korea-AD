"use client";

import { Modal } from "@/components/ui/modal";
import { useAddTranslateModal } from "@/hooks/use-tag-modal";
import AddTranslateForm from "../forms/add-translate-form";

export default function AddTranslateModal() {
  const addTranslateModal = useAddTranslateModal();

  return (
    <Modal
      title=""
      description=""
      isOpen={addTranslateModal.isOpen}
      onClose={addTranslateModal.onClose}
    >
      <AddTranslateForm />
    </Modal>
  );
}
