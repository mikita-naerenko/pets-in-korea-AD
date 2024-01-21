import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Article, News, Theme } from "@/lib/interfaces";

export async function GET(req: Request | NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  if (query) {
    try {
      const articles = await prismadb.articles.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            // { content: { contains: query } },
          ],
        },
      });

      const themes = await prismadb.theme.findMany({
        where: {
          rusLabel: { contains: query },
          description: { contains: query },
        },
      });

      const news = await prismadb.news.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            // { content: { contains: query } },
          ],
        },
      });
      //   const generateResult = (articles: Article[] | [], news: News[] | [], themes: Theme[] | []) => {
      //     const result = [];
      //     articles.forEach((item) => result.push({id: item.id, }))
      //   }
      return NextResponse.json({
        articles: articles,
        news: news,
        themes: themes,
      });
    } catch (error) {
      console.log("SEARCH_ERROR", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}
