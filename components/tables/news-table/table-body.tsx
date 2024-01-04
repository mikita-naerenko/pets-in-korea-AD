"use client";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { News } from "@/lib/interfaces";

import { useRouter } from "next/navigation";
import EditButton from "../../buttons/edit-button";
import ViewButton from "../../buttons/view-article-button";
import Image from "next/image";
import MoveToTrashButton from "../../buttons/move-to-trash-button";
import { BadgeCheck, BadgeMinus } from "lucide-react";

export default function NewsTableBody({ newsList }: { newsList: News[] }) {
  const router = useRouter();

  return (
    <TableBody>
      {newsList.map((news) => {
        return (
          <TableRow
            key={news.id}
            onClick={() => router.push(`/news/${news.id}`)}
          >
            <TableCell className="font-medium">{news.title}</TableCell>
            <TableCell className="font-medium">
              {news.images && news.images.length > 0 ? (
                <Image
                  width={70}
                  alt={news.title}
                  src={news.images[0].url}
                  height={30}
                />
              ) : (
                ""
              )}
            </TableCell>
            <TableCell>{news.description}</TableCell>
            <TableCell>
              {news.linkToSource ? (
                <BadgeCheck color="#17b60c" />
              ) : (
                <BadgeMinus color="#df0707" />
              )}
            </TableCell>
            <TableCell>
              {news.nameOfSource ? (
                <BadgeCheck color="#17b60c" />
              ) : (
                <BadgeMinus color="#df0707" />
              )}
            </TableCell>
            <TableCell>
              {new Date(news.createdAt).toLocaleString("ru-RU")}
            </TableCell>
            <TableCell>
              {new Date(news.updatedAt).toLocaleString("ru-RU")}
            </TableCell>
            <TableCell>
              <ViewButton article={news} type={"news"} />
              <EditButton article={news} type={"news"} />
              <MoveToTrashButton
                itemId={news.id}
                itemName={news.title}
                typeOfItem="news"
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
