import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET({ params }: { params: { storeId: string } }) {
  try {
    const article = await prismadb.articles.findFirst({
      where: {
        id: params.storeId,
      },
    });
    return NextResponse.json(article);
  } catch (error) {
    console.log("[ARTICLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { articleId: string } }
) {
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
    return new NextResponse("Title is required", { status: 403 });
  }
  if (!description) {
    return new NextResponse("Description is required", { status: 403 });
  }
  if (!content) {
    return new NextResponse("Content is required", { status: 403 });
  }
  if (!tagsList) {
    return new NextResponse("TagList is required", { status: 403 });
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin" && role !== "editor") {
    return new NextResponse("Not enough privileges to perform this action.", {
      status: 403,
    });
  }

  try {
    const article = await prismadb.articles.update({
      where: {
        id: params.articleId,
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
        },
      },
    });
    const image = await prismadb.articles.update({
      where: {
        id: params.articleId,
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
    console.log("[ARTICLES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // MOVE TO THE TRASH
  const { userId } = auth();
  const itemID = req.url.split("/").pop();
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

  const removingItem = await prismadb.articles.findFirst({
    where: {
      id: itemID,
    },
    include: {
      tags: true,
      images: true,
    },
  });

  if (!removingItem) {
    throw new Error("_____ITEM_MOT_FOUND_IN_TABLE_ARTICLES_____");
  }
  const movetToTrash = await prismadb.trash.create({
    data: {
      removedItemType: "Article",
      title: removingItem.title,
      description: removingItem?.description,
      content: removingItem?.content,
      createdAt: removingItem?.createdAt,
      updatedAt: removingItem?.updatedAt,
      nameOfSource: removingItem?.nameOfSource,
      linkToSource: removingItem?.linkToSource,
      authorName: removingItem?.authorName,
      authorLink: removingItem?.authorLink,
      tags: JSON.stringify(removingItem?.tags),
      images: JSON.stringify(removingItem?.images),
    },
  });

  const articleById = await prismadb.articles.delete({
    where: {
      id: itemID,
    },
  });
  return NextResponse.json(articleById);
}
