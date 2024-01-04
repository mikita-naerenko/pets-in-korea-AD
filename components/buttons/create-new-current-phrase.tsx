"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";

export default function CreateNewCurrentPhrase() {
  const router = useRouter();

  const handleEditClick = (): void => {
    router.push(`/createNewPhrase`);
  };

  return (
    <CustomTooltipWrapper title="Create New Phrase">
      <Button className="w-full" variant="outline" onClick={handleEditClick}>
        <Plus />
      </Button>
    </CustomTooltipWrapper>
  );
}
