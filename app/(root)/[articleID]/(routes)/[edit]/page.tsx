import prismadb from "@/lib/prismadb";

import EditForm from "@/components/forms/edit-forms";

interface Params {
  params: {
    articleID: string;
  };
  searchParams: Record<string, never>;
}

export default async function Page(params: Params) {
  const article = await prismadb.articles.findFirst({
    where: {
      id: params.params.articleID,
    },
    include: { tags: true, images: true },
  });

  return (
    <>
      <div className=" w-7/12">
        {article ? <EditForm article={article} /> : <p>Article not found</p>}
      </div>
    </>
  );
}
