"use client";

import { Modal } from "@/components/ui/modal";
import { useModalEdit } from "@/hooks/use-tag-modal";
import EditPhraseForm from "../forms/edit-phrase-form";
import EditTranslateForm from "../forms/edit-translate-form";

export default function EditDictionaryModal() {
  const modalEdit = useModalEdit();

  return (
    <Modal
      title=""
      description=""
      isOpen={modalEdit.isOpen}
      onClose={modalEdit.onClose}
    >
      {modalEdit.item && modalEdit.item.type === "phrase" ? (
        <EditPhraseForm />
      ) : (
        <EditTranslateForm />
      )}
    </Modal>
  );
}
