import EditButton from "@/components/buttons/edit-button";
import prismadb from "@/lib/prismadb";
import ArticleImage from "@/components/ui/article-image";
import BackToMainButton from "@/components/buttons/back-to-the-previous-button";
import Viewer from "@/components/viewer";
import { Article } from "@/lib/interfaces";
// import { useEffect, useState } from "react";

interface Params {
  params: {
    articleID: string;
  };
  searchParams: Record<string, never>;
}

export default async function SinglePage(params: Params) {
  const article: Article | null = await prismadb.articles.findFirst({
    where: {
      id: params.params.articleID,
    },
    include: { tags: true, images: true },
  });

  return (
    <>
      <div className=" w-7/12 border flex flex-col items-center mb-3 mt-3 text-neutral-400 relative">
        <div className="absolute top-0 left-0">
          <BackToMainButton />
        </div>
        <div className="absolute top-0 right-0">
          {article ? <EditButton article={article} type={"article"} /> : null}
        </div>
        <span>Title:</span>
        <h1 className="text-3xl text-center px-20 text-black">
          {article?.title}
        </h1>
      </div>
      <div className=" w-7/12 border mb-3 ">
        {article && article.images && article.images.length > 0 ? (
          article.images.map((img) => (
            <ArticleImage url={img.url} title={article.title} key={img.url} />
          ))
        ) : (
          <p>No images avaliable</p>
        )}
      </div>
      <div className=" w-7/12 border mb-3 text-neutral-400">
        <span>Tags:</span>
        <div className="flex flex-wrap text-black">
          {article &&
            article.tags &&
            article.tags.map((tag) => {
              return (
                <p key={tag.id} className="text-xl mr-2">
                  #{tag.label}
                </p>
              );
            })}
        </div>
      </div>
      <div className=" w-7/12 border mb-3 text-neutral-400">
        <span>Description:</span>
        <h2 className="text-md text-black">{article?.description}</h2>
      </div>
      <div className=" w-7/12 border mb-3 flex flex-wrap text-neutral-400">
        <span>Author&apos;s name:</span>
        <h2 className="ml-3 text-black">
          {article?.authorName ? article?.authorName : "none"}
        </h2>
      </div>
      <div className=" w-7/12 border mb-3 flex flex-wrap text-neutral-400">
        <span>Author&apos;s link:</span>
        <h2 className="ml-3 text-black">
          {article?.authorLink ? article?.authorLink : "none"}
        </h2>
      </div>
      <div className=" w-7/12 border mb-3 flex flex-wrap text-neutral-400">
        <span>Resource name:</span>
        <h2 className="ml-3 text-black">
          {article?.nameOfSource ? article?.nameOfSource : "none"}
        </h2>
      </div>
      <div className=" w-7/12 border mb-3 flex flex-wrap text-neutral-400">
        <span>Resource link:</span>
        <h2 className="ml-3 text-black">
          {article?.linkToSource ? article?.linkToSource : "none"}
        </h2>
      </div>
      <div className=" w-7/12 border mb-3 text-neutral-400">
        <span>Text Content:</span>
        {article ? <Viewer article={article} /> : "not found"}
      </div>
    </>
  );
}
