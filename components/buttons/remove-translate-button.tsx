"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";
import { useMoveToTrashModal } from "@/hooks/use-move-to-trash-modal";
import { toast } from "react-hot-toast";

const RemoveTranslateButton = ({
  item,
}: {
  item: {
    itemId: string;
    itemName: string;
    typeOfItem: string;
  };
}) => {
  const moveToTrashModal = useMoveToTrashModal();

  const handleEditClick = () => {
    if (item.typeOfItem === "rusTranslate") {
      return toast.error("Russian translate is required!");
    }
    moveToTrashModal.setItem(item);
    moveToTrashModal.onOpen();
  };

  return (
    <CustomTooltipWrapper title="Move to the trash">
      <Button
        size="icon"
        className="w-3 text-slate-400"
        variant="ghost"
        onClick={handleEditClick}
      >
        <Trash2 />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default RemoveTranslateButton;
