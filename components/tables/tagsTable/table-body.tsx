"use client";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Tag } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import MoveToTrashButton from "@/components/buttons/move-to-trash-button";
import EditButton from "@/components/buttons/edit-button";
import Image from "next/image";

const TagsTableBody = ({ tagsList }: { tagsList: Tag[] }) => {
  return (
    <TableBody>
      {tagsList.map((tag) => {
        return (
          <TableRow key={tag.id}>
            <TableCell className="font-medium">{tag.label}</TableCell>
            <TableCell className="font-medium">{tag.rusTitle}</TableCell>
            <TableCell className="font-medium">
              {tag.images[0]?.url ? (
                <Image
                  src={tag.images[0].url}
                  width={50}
                  height={40}
                  alt="smthng"
                />
              ) : (
                "none"
              )}

              {/* {tag.images[0]?.url || "none"} */}
            </TableCell>
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
              <EditButton article={tag} type="tag" />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default TagsTableBody;
