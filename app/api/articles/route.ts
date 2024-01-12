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
      tagsList,
      nameOfSource,
      linkToSource,
      authorName,
      authorLink,
      images,
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
    if (tagsList.length < 1) {
      return new NextResponse("Main text is required", { status: 400 });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const store = await prismadb.articles.create({
      data: {
        userId,
        title,
        description,
        content,
        nameOfSource,
        linkToSource,
        authorName,
        authorLink,
        tags: {
          connect: tagsList.map((tag: string) => ({ id: tag })),
        },
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[ARTICLES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const articles = await prismadb.articles.findMany({
      include: { tags: true, images: true },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.log("[ARTICLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function DELETE(item: string) {
//   console.log("pass");
//   console.log(item);
// }
