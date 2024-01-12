import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../../helper";

export async function PATCH(
  req: Request,
  { params }: { params: { newsId: string } }
) {
  const { userId } = auth();
  const body = await req.json();

  const {
    title,
    description,
    content,
    nameOfSource,
    linkToSource,
    authorName,
    authorLink,
    images,
    tagsList,
  } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!title) {
      return new NextResponse("Title is required", {
        status: 403,
      });
    }
    if (!description) {
      return new NextResponse("Description is required", {
        status: 403,
      });
    }
    if (!content) {
      return new NextResponse("Content is required", {
        status: 403,
      });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const news = await prismadb.news.update({
      where: {
        id: params.newsId,
      },
      data: {
        title,
        description,
        content,
        nameOfSource,
        linkToSource,
        authorName,
        authorLink,
        tags: {
          set: tagsList.map((tag: string) => ({ id: tag })),
        },
        images: {
          deleteMany: {},
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.log("[NEWS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // MOVE TO THE TRASH
  const itemID = req.url.split("/").pop();
  const { userId } = auth();

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const removingItem = await prismadb.news.findFirst({
      where: {
        id: itemID,
      },
      include: {
        images: true,
        tags: true,
      },
    });

    if (!removingItem) {
      throw new Error("_____ITEM_MOT_FOUND_IN_TABLE_ARTICLES_____");
    }
    const movetToTrash = await prismadb.trash.create({
      data: {
        removedItemType: "News",
        title: removingItem.title,
        description: removingItem?.description,
        content: removingItem?.content,
        nameOfSource: removingItem?.nameOfSource,
        linkToSource: removingItem?.linkToSource,
        authorName: removingItem?.authorName,
        authorLink: removingItem?.authorLink,
        createdAt: removingItem?.createdAt,
        updatedAt: removingItem?.updatedAt,
        tags: JSON.stringify(removingItem?.tags),
        images: JSON.stringify(removingItem?.images),
      },
    });

    const articleById = await prismadb.news.delete({
      where: {
        id: itemID,
      },
    });
    return NextResponse.json(articleById);
  } catch (error) {
    console.log("[NEWS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
