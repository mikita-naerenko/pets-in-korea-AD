"use client";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function CreateNewsButton() {
  const router = useRouter();

  const handleEditClick = (): void => {
    router.push(`/createNews`);
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleEditClick}>
      Create a News
    </Button>
  );
}
