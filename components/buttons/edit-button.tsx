"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Article } from "@/lib/interfaces";
import CustomTooltipWrapper from "../ui/custom-tooltip-wrapper";

// interface ButtonProps {
//   article: Article;
// }
interface ButtonProps {
  article: { id: string };
  type: string;
}

const EditButton: React.FC<ButtonProps> = ({ article, type }) => {
  const router = useRouter();

  const handleEditClick = (): void => {
    if (type === "news") {
      window.location.assign(`/news/${article.id}/edit`);
    } else {
      window.location.assign(`/${article.id}/edit`);
    }
  };

  return (
    <CustomTooltipWrapper title="Edit">
      <Button size="icon" variant="ghost" onClick={handleEditClick}>
        <Pencil />
      </Button>
    </CustomTooltipWrapper>
  );
};

export default EditButton;
