import { Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("target") || undefined;

    if (target === "articles") {
      const count = await prismadb.articles.count();
      return NextResponse.json(count);
    } else if (target === "news") {
      const count = await prismadb.news.count();
      return NextResponse.json(count);
    } else if (target === "theme") {
      const count = await prismadb.theme.count();
      return NextResponse.json(count);
    } else if (target === "koreanPhrase") {
      const count = await prismadb.koreanPhrase.count();
      return NextResponse.json(count);
    } else if (target === "tag") {
      const count = await prismadb.tag.count();
      return NextResponse.json(count);
    } else {
      console.error(`Invalid or missing target: ${target}`);
      return new NextResponse("Bad Request", { status: 400 });
    }
  } catch (error) {
    console.error("[ARTICLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
