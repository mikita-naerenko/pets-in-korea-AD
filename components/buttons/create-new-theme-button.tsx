"use client";

import { Button } from "../ui/button";
import { useThemeModal } from "@/hooks/use-tag-modal";

export default function CreateNewThemeButton() {
  const themeModal = useThemeModal();

  return (
    <Button className="w-full" variant="outline" onClick={themeModal.onOpen}>
      Create New Theme
    </Button>
  );
}
