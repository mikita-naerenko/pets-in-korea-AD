"use client";

import { Button } from "../ui/button";
import { useThemeModal } from "@/hooks/use-tag-modal";
import { useRouter } from "next/navigation";

export default function CreateNewThemeButton() {
  const themeModal = useThemeModal();

  const router = useRouter();

  const handleEditClick = (): void => {
    router.push(`/create-theme`);
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleEditClick}>
      Create New Theme
    </Button>
  );
}
