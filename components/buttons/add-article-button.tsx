"use client";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function AddArticleButton() {
  const router = useRouter();

  const handleEditClick = (): void => {
    router.push(`/createArticle`);
  };

  return (
    <Button
      // disabled={loading}
      className="w-full"
      variant="outline"
      onClick={handleEditClick}
    >
      Create a New Article
    </Button>
  );
}
