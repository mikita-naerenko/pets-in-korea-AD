"use client";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function CreateNewPhrase() {
  const router = useRouter();

  const handleEditClick = (): void => {
    router.push(`/createNewPhrase`);
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleEditClick}>
      Create New Phrase
    </Button>
  );
}
