// "use client";
import ArticlesTable from "@/components/tables/articles-table/articles-table";
import ThemesTable from "@/components/tables/themes-table/themes-table";
import prismadb from "@/lib/prismadb";
import SideBar from "@/components/side-bar";
import { Theme, News } from "@/lib/interfaces";
import NewsTable from "@/components/tables/news-table/news-table";

const RootPage = async () => {
  const tags = await prismadb.tag.findMany();

  const themes = await prismadb.theme.findMany({
    include: {
      images: true,
      tags: true,
      phrases: {
        include: {
          rusTranslates: true,
          engTranslates: true,
        },
      },
    },
  });

  const newsList: News[] = await prismadb.news.findMany({
    include: {
      images: true,
    },
  });
  return (
    <main>
      <div className="pr-48">
        <SideBar tags={tags} />
        <ArticlesTable />
        <ThemesTable themes={themes} />
        <NewsTable newsList={newsList} />
      </div>
    </main>
  );
};

export default RootPage;
