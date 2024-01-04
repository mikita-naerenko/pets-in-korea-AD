"use client";

import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useMoveToTrashModal } from "@/hooks/use-move-to-trash-modal";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";

interface ButtonProps {
  itemId: string;
  itemName: string;
  typeOfItem: string;
}

const MoveToTrashButton: React.FC<ButtonProps> = ({
  itemId,
  itemName,
  typeOfItem,
}) => {
  const moveToTrash = useMoveToTrashModal();

  const handleClick = (): void => {
    moveToTrash.onOpen();
    moveToTrash.setItem({
      itemId: itemId,
      itemName: itemName,
      typeOfItem: typeOfItem,
    });
  };

  return (
    <CustomTooltipWrapper title="Move To The Trash">
      <Button size="icon" variant="ghost" onClick={handleClick}>
        <Trash2 />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default MoveToTrashButton;
