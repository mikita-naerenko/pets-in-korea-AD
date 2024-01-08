import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tagLabel = searchParams.get("tagLabel") || undefined;
    const tagId = searchParams.get("tagId") || undefined;

    if (tagId) {
      const tag = await prismadb.tag.findUnique({
        where: {
          id: tagId,
        },
        include: { images: true },
      });
      return NextResponse.json(tag);
    } else if (tagLabel) {
      const tag = await prismadb.tag.findFirst({
        where: {
          label: tagLabel,
        },
        include: { images: true },
      });
      return NextResponse.json(tag);
    } else {
      const tags = await prismadb.tag.findMany({
        include: { images: true },
      });

      return NextResponse.json(tags);
    }
  } catch (error) {
    console.log("[TAG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
