import EditButton from "@/components/buttons/edit-button";
import prismadb from "@/lib/prismadb";
import ArticleImage from "@/components/ui/article-image";
import BackToMainButton from "@/components/buttons/back-to-the-previous-button";
import Viewer from "@/components/viewer";

interface Params {
  params: {
    newsId: string;
  };
  searchParams: Record<string, never>;
}

export default async function SinglePage(params: Params) {
  const news = await prismadb.news.findFirst({
    where: {
      id: params.params.newsId,
    },
    include: { images: true },
  });

  return (
    <>
      <div className=" w-7/12 border flex flex-col items-center mb-3 mt-3 relative">
        <div className="absolute top-0 left-0">
          <BackToMainButton />
        </div>
        <div className="absolute top-0 right-0">
          {news ? <EditButton article={news} type={"news"} /> : null}
        </div>
        <span>Title:</span>
        <h1 className="text-3xl text-center px-20">{news?.title}</h1>
      </div>
      <div className=" w-7/12 border mb-3 ">
        {news && news.images.length > 0 ? (
          news.images.map((img) => (
            <ArticleImage url={img.url} title={news.title} key={img.url} />
          ))
        ) : (
          <p>No images avaliable</p>
        )}
      </div>

      <div className=" w-7/12 border mb-3 ">
        <span>Description:</span>
        <h2 className="text-xl">{news?.description}</h2>
      </div>
      <div className=" w-7/12 border mb-3 ">
        <span>Text Content:</span>
        {news ? <Viewer article={news} /> : "not found"}
      </div>
      <div className=" w-7/12 border mb-3 ">
        <span>Link to source:</span>
        <p>{news?.linkToSource}</p>
      </div>
      <div className=" w-7/12 border mb-3 ">
        <span>Name of source:</span>
        <p>{news?.nameOfSource}</p>
      </div>
    </>
  );
}
