"use client";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { TagList } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import MoveToTrashButton from "@/components/buttons/move-to-trash-button";

const TagsTableBody = ({ tagsList }: { tagsList: TagList[] }) => {
  return (
    <TableBody>
      {tagsList.map((tag) => {
        return (
          <TableRow key={tag.id}>
            <TableCell className="font-medium">{tag.label}</TableCell>
            <TableCell className="font-medium">{tag.articles.length}</TableCell>
            <TableCell>
              <Button variant="ghost">View all </Button>
            </TableCell>
            <TableCell>
              <MoveToTrashButton
                itemId={tag.id || "null"}
                itemName={tag.label || "null"}
                typeOfItem="tag"
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default TagsTableBody;
