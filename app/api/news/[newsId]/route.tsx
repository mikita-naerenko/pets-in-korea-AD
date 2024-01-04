import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

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
  } = body;

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

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin" && role !== "editor") {
    return new NextResponse("Not enough privileges to perform this action.", {
      status: 403,
    });
  }

  try {
    const article = await prismadb.news.update({
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
        images: {
          deleteMany: {},
        },
      },
    });
    const image = await prismadb.news.update({
      where: {
        id: params.newsId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.log("[NEWS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // MOVE TO THE TRASH
  const itemID = req.url.split("/").pop();
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin" && role !== "editor") {
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
      images: JSON.stringify(removingItem?.images),
    },
  });

  const articleById = await prismadb.news.delete({
    where: {
      id: itemID,
    },
  });
  return NextResponse.json(articleById);
}
