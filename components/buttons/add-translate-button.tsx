"use client";

import { BadgePlus } from "lucide-react";
import { Button } from "../ui/button";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";
import { useAddTranslateModal } from "@/hooks/use-tag-modal";

const AddTranslateButton = ({
  item,
}: {
  item: {
    type: string;
    phraseId: string;
    theme: string;
  };
}) => {
  const addTranslateModal = useAddTranslateModal();

  const handleEditClick = (): void => {
    addTranslateModal.setItem(item);
    addTranslateModal.onOpen();
  };

  return (
    <CustomTooltipWrapper title="Add Translate">
      <Button
        size="icon"
        className="w-3 text-slate-400"
        variant="ghost"
        onClick={handleEditClick}
      >
        <BadgePlus />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default AddTranslateButton;
