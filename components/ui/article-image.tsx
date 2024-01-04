"use client";
import Image from "next/image";

interface ArticleImageProps {
  url: string;
  title: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ url, title }) => (
  <Image src={url} width="200" height="200" alt={title} />
);

export default ArticleImage;
