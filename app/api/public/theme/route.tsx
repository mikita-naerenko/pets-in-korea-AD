import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || undefined;

  try {
    if (id) {
      const theme = await prismadb.theme.findUnique({
        where: {
          id,
        },
        include: {
          phrases: {
            include: {
              rusTranslates: true,
              engTranslates: true,
            },
          },
          images: true,
        },
      });
      return NextResponse.json(theme);
    } else {
      const themes = await prismadb.theme.findMany({
        include: {
          phrases: {
            include: {
              rusTranslates: true,
              engTranslates: true,
            },
          },
          images: true,
        },
      });

      return NextResponse.json(themes);
    }
  } catch (error) {
    console.log("[THEMES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
