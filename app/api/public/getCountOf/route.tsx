import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("target") || undefined;
    const allowedFields = Object.keys(prismadb);
    if (target && allowedFields.includes(target)) {
      const count = await prismadb[target].count();
      return NextResponse.json(count);
    } else {
      console.error(`Invalid or missing target: ${target}`);
      return new NextResponse("Bad Request", { status: 400 });
    }
  } catch (error) {
    console.log("[ARTICLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
