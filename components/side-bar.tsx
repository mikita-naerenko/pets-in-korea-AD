"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSelectedTagsState } from "@/hooks/use-selected-tags";

interface Tag {
  id: string;
  label: string;
  // Add other properties if present in your Tag model
}

interface SideBarProps {
  tags: Tag[];
}

const SideBar: React.FC<SideBarProps> = ({ tags }) => {
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const selectedTagsState = useSelectedTagsState();

  const handleClick = (id: string) => {
    if (selectedTag.includes(id)) {
      setSelectedTag(() => selectedTag.filter((tag) => tag !== id));
      selectedTagsState.onRemoved(id);
    } else {
      setSelectedTag((selectedTag) => [...selectedTag, id]);
      selectedTagsState.onSelected(id);
    }
  };

  return (
    <div className="absolute right-0 h-full">
      <h4 className="my-4 text-center text-sm font-medium leading-none ">
        Tags
      </h4>
      <ScrollArea className="h-full w-48 rounded-md border">
        <div className="p-4 flex flex-wrap">
          {tags.map((tag) => (
            <div key={tag.id} className="text-sm">
              <Button
                onClick={() => handleClick(tag.id)}
                variant={selectedTag.includes(tag.id) ? "default" : "outline"}
              >
                {tag.label}
              </Button>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SideBar;
