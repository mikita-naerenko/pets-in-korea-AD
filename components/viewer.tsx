"use client";
import { Article, News } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import he from "he";

export default function Viewer({ article }: { article: Article | News }) {
  const [decodedHTML, setDecodedHTML] = useState("");

  useEffect(() => {
    const decodeHTML = (input: string) => {
      return he.decode(input);
    };

    setDecodedHTML(decodeHTML(article.content));
  }, [article]);

  return (
    <div
      className="text-black"
      dangerouslySetInnerHTML={{ __html: decodedHTML }}
    />
  );
}
