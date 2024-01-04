import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const tags = await prismadb.tag.findMany({
      include: { images: true },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.log("[TAG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
