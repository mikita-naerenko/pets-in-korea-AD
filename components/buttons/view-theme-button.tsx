"use client";

import { View } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Theme } from "@/lib/interfaces";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";

interface ButtonProps {
  theme: Theme;
}

const ViewThemeButton: React.FC<ButtonProps> = ({ theme }) => {
  const router = useRouter();

  const handleViewClick = (el: { id: string }): void => {
    router.push(`/dictionary/${el.id}`);
  };

  return (
    <CustomTooltipWrapper title="View Theme">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => handleViewClick(theme)}
      >
        <View />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default ViewThemeButton;
