import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getRandom } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const take = searchParams.get("take");
    const id = searchParams.get("id");
    const random = searchParams.get("random") || undefined;

    const takeNumber = take ? parseInt(take, 10) : undefined;

    if (id) {
      const news = await prismadb.news.findUnique({
        where: {
          id,
        },
        include: { images: true },
      });
      return NextResponse.json(news);
    } else if (take) {
      const news = await prismadb.news.findMany({
        orderBy: {
          createdAt: "desc", // Order by createdAt field in descending order
        },
        include: { images: true },
        take: takeNumber,
      });

      return NextResponse.json(news);
    } else if (random) {
      // random
      const articlesId = await prismadb.news.findMany({
        select: { id: true },
      });

      const randomArticles = await prismadb.news.findMany({
        where: {
          id: {
            in: getRandom(+random, articlesId),
          },
        },
        include: { images: true },
      });
      return NextResponse.json(randomArticles);
    }
  } catch (error) {
    console.log("[NEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
