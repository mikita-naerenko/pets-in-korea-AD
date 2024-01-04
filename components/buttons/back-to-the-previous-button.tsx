"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackToMainButton() {
  const router = useRouter();
  const onclickHandler = () => {
    router.back();
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={onclickHandler}>
            <MoveLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Back to the previous page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
