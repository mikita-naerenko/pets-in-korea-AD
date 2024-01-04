"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function AddTagButton() {
  const router = useRouter();

  return (
    <Button
      // disabled={loading}
      className="w-full"
      variant="outline"
      onClick={() => router.push("/create-tag")}
    >
      Add new Tag
    </Button>
  );
}
