"use client";

import { View } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Article } from "@/lib/interfaces";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";

interface ButtonProps {
  article: { id: string };
  type: string;
}

const ViewButton: React.FC<ButtonProps> = ({ article, type }) => {
  const router = useRouter();

  const handleViewClick = (el: { id: string }): void => {
    if (type === "news") {
      router.push(`/news/${el.id}`);
    } else {
      router.push(`/${el.id}`);
    }
  };

  return (
    <CustomTooltipWrapper title="View Article">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => handleViewClick(article)}
      >
        <View />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default ViewButton;
