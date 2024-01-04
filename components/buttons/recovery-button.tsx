import { Recycle } from "lucide-react";
import { Button } from "../ui/button";
import { useRecoveryModal } from "@/hooks/use-recovery-modal";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";

export default function RecoveryButton({
  type,
  id,
}: {
  type: string;
  id: string;
}) {
  const recoveryModal = useRecoveryModal();
  const handleClick = () => {
    recoveryModal.onOpen();
    recoveryModal.setItem(id);
  };
  return (
    <CustomTooltipWrapper title="Recover">
      <Button size="icon" variant="ghost" onClick={handleClick}>
        <Recycle />
      </Button>
    </CustomTooltipWrapper>
  );
}
