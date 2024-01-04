"use client";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Article } from "@/lib/interfaces";

import { useSortByDate } from "@/hooks/use-sort-data";
import MoveToTrashButton from "../../buttons/move-to-trash-button";
import { RemovedItem } from "@/lib/interfaces";
import RecoveryButton from "@/components/buttons/recovery-button";

const RemovedItemsTableBody: React.FC<{ items: RemovedItem[] }> = ({
  items,
}) => {
  const sortByDate = useSortByDate();

  const sortedArticles = (articles: RemovedItem[], selected: string) => {
    const sortArticlesByCreate = (items: RemovedItem[]) =>
      items.sort((a, b) =>
        a.createdAt && b.createdAt
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(a.removedAt).getTime() - new Date(b.removedAt).getTime()
      );

    const sortArticlesByUpdate = (items: RemovedItem[]) =>
      items.sort(
        (a, b) =>
          new Date(a.removedAt).getTime() - new Date(b.removedAt).getTime()
      );
    switch (selected) {
      case "":
        return items;
      case "SortUpCreate":
        return sortArticlesByCreate(items);
      case "SortDownCreate":
        return sortArticlesByCreate(items).reverse();
      case "SortUpUpdate":
        return sortArticlesByUpdate(items);
      case "SortDownUpdate":
        return sortArticlesByUpdate(items).reverse();
      default:
        return articles;
    }
  };

  const showedArticles = sortedArticles(items, sortByDate.selected);

  return (
    <TableBody>
      {showedArticles.map((el) => {
        return (
          <TableRow key={el.id}>
            <TableCell className="font-medium">{el.removedItemType}</TableCell>
            <TableCell className="font-medium">{el.title}</TableCell>
            {/* <TableCell className="font-medium">
              {el.images.length > 0 ? (
                <Image
                  width={30}
                  alt={el.title}
                  src={el.images[0].url}
                  height={20}
                />
              ) : (
                ""
              )}
            </TableCell> */}
            <TableCell>
              {el.createdAt ? new Date(el.createdAt).toLocaleString() : "-"}
            </TableCell>
            <TableCell>{new Date(el.removedAt).toLocaleString()}</TableCell>
            <TableCell>
              <MoveToTrashButton
                itemId={el?.id || "null"}
                itemName={el?.title || "null"}
                typeOfItem="alreadyInTrash"
              />
              <RecoveryButton id={el.id} type={el.removedItemType} />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default RemovedItemsTableBody;
