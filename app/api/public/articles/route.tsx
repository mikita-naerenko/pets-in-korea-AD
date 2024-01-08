import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getRandom } from "@/lib/utils";

export async function GET(req: Request | NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const tagId = searchParams.get("tagId") || undefined;
    const id = searchParams.get("id") || undefined;
    const random = searchParams.get("random") || undefined;
    const tagLabel = searchParams.get("tagLabel") || undefined;

    if (random) {
      // random
      const articlesId = await prismadb.articles.findMany({
        select: { id: true },
      });

      const randomArticles = await prismadb.articles.findMany({
        where: {
          id: {
            in: getRandom(+random, articlesId),
          },
        },
        include: { tags: true, images: true },
      });
      return NextResponse.json(randomArticles);
    } else if (id) {
      // Single item
      const article = await prismadb.articles.findUnique({
        where: { id: id },
        include: { tags: true, images: true },
      });
      return NextResponse.json(article);
    } else if (tagId) {
      //By tag's name
      const articles = await prismadb.articles.findMany({
        where: {
          tags: {
            some: {
              id: tagId,
            },
          },
        },
        include: { tags: true, images: true },
      });

      return NextResponse.json(articles);
    } else if (tagLabel) {
      //By tag's name
      const articles = await prismadb.articles.findMany({
        where: {
          tags: {
            some: {
              label: tagLabel,
            },
          },
        },
        include: { tags: true, images: true },
      });

      return NextResponse.json(articles);
    } else {
      // Return all articles
      const articles = await prismadb.articles.findMany({
        include: { tags: true, images: true },
      });
      return NextResponse.json(articles);
    }
  } catch (error) {
    console.log("[ARTICLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
