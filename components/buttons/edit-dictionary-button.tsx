"use client";

import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";
import { useModalEdit } from "@/hooks/use-tag-modal";

const EditDictionaryButton = ({
  item,
}: {
  item: {
    id: string;
    type: string;
    content: { phrase?: string; translate?: string; transcription?: string };
  };
}) => {
  const modalEdit = useModalEdit();

  const handleEditClick = (): void => {
    modalEdit.setItem(item);
    modalEdit.onOpen();
  };

  return (
    <CustomTooltipWrapper title="Edit">
      <Button
        size="icon"
        className="w-3 text-slate-400"
        variant="ghost"
        onClick={handleEditClick}
      >
        <Pencil />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default EditDictionaryButton;
