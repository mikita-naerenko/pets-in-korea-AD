import prismadb from "@/lib/prismadb";

import EditNewsForm from "@/components/forms/edit-news-form";
import { News } from "@/lib/interfaces";
import BackToMainButton from "@/components/buttons/back-to-the-previous-button";

interface Params {
  params: {
    newsId: string;
  };
  searchParams: Record<string, never>;
}

export default async function Page(params: Params) {
  const news: News | null = await prismadb.news.findFirst({
    where: {
      id: params.params.newsId,
    },
    include: { images: true },
  });

  return (
    <>
      <div className=" w-7/12 relative">
        <div className="absolute top-300 left-300">
          <BackToMainButton />
        </div>
        {news ? <EditNewsForm news={news} /> : <p>News not found</p>}
      </div>
    </>
  );
}
