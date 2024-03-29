import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../helper";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      title,
      description,
      content,
      images,
      nameOfSource,
      linkToSource,
      authorName,
      authorLink,
      tagsList,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!title) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Title is required", { status: 400 });
    }
    if (!content) {
      return new NextResponse("Main text is required", { status: 400 });
    }
    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const store = await prismadb.news.create({
      data: {
        userId,
        title,
        description,
        content,
        nameOfSource,
        linkToSource,
        authorName,
        authorLink,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        tags: {
          connect: tagsList.map((tag: string) => ({ id: tag })),
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[ARTICLES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
