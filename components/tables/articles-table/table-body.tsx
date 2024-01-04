"use client";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Article } from "@/lib/interfaces";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelectedTagsState } from "@/hooks/use-selected-tags";
import { useSortByDate } from "@/hooks/use-sort-data";
import EditButton from "../../buttons/edit-button";
import ViewButton from "../../buttons/view-article-button";
import Image from "next/image";
import MoveToTrashButton from "../../buttons/move-to-trash-button";
import { BadgeCheck, BadgeMinus } from "lucide-react";

interface ApiResponse<T> {
  data: T[];
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: object;
}

export default function ArticlesTableBody() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();
  const selectedTagsState = useSelectedTagsState();
  const sortByDate = useSortByDate();
  const selectedTags = new Set(selectedTagsState.selected);
  const filteresArticles =
    selectedTags.size > 0
      ? articles.filter(
          (article) =>
            article.tags && article.tags.some((tag) => selectedTags.has(tag.id))
        )
      : articles;

  const sortedArticles = (articles: Article[], selected: string): Article[] => {
    const sortArticlesByCreate = (articles: Article[]) =>
      articles.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const sortArticlesByUpdate = (articles: Article[]) =>
      articles.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    switch (selected) {
      case "":
        return articles;
      case "SortUpCreate":
        return sortArticlesByCreate(articles);
      case "SortDownCreate":
        return sortArticlesByCreate(articles).reverse();
      case "SortUpUpdate":
        return sortArticlesByUpdate(articles);
      case "SortDownUpdate":
        return sortArticlesByUpdate(articles).reverse();
      default:
        return articles;
    }
  };

  const showedArticles = sortedArticles(filteresArticles, sortByDate.selected);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ApiResponse<Article> = await axios.get("/api/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <TableBody>
      {showedArticles.map((el) => {
        return (
          <TableRow onClick={() => router.push(el.id)} key={el.id}>
            <TableCell className="font-medium">{el.title}</TableCell>
            <TableCell className="font-medium">
              {el.images && el.images.length > 0 ? (
                <Image
                  style={{ minWidth: "100px" }}
                  width={70}
                  alt={el.title}
                  src={el.images[0].url}
                  height={40}
                />
              ) : (
                ""
              )}
            </TableCell>
            <TableCell>{el.description}</TableCell>
            <TableCell>
              {el.linkToSource ? (
                <BadgeCheck color="#17b60c" />
              ) : (
                <BadgeMinus color="#df0707" />
              )}
            </TableCell>
            <TableCell>
              {el.nameOfSource ? (
                <BadgeCheck color="#17b60c" />
              ) : (
                <BadgeMinus color="#df0707" />
              )}
            </TableCell>
            <TableCell>
              {el.authorName ? (
                <BadgeCheck color="#17b60c" />
              ) : (
                <BadgeMinus color="#df0707" />
              )}
            </TableCell>
            <TableCell>
              {el.authorLink ? (
                <BadgeCheck color="#17b60c" />
              ) : (
                <BadgeMinus color="#df0707" />
              )}
            </TableCell>
            <TableCell>
              {new Date(el.createdAt).toLocaleString("ru-RU")}
            </TableCell>
            <TableCell>
              {new Date(el.updatedAt).toLocaleString("ru-RU")}
            </TableCell>
            <TableCell>
              <ViewButton article={el} type={"article"} />
              <EditButton article={el} type={"article"} />
              <MoveToTrashButton
                itemId={el.id}
                itemName={el.title}
                typeOfItem="article"
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
