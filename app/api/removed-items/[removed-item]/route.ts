import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import {
  removeItemFromDb,
  removeImageFromCloudinary,
  recoverArticle,
  recoverNews,
  recoverTheme,
  recoverPhrase,
} from "./helper";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../../helper";

export async function DELETE(req: Request) {
  // Permanently remove from the trash
  const { userId } = auth();
  const id: string | undefined = req.url.split("/").pop(); //Get id from request

  try {
    if (!id) {
      return new NextResponse("Item's id not found!", { status: 403 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }
    // Find removind item
    const item = await prismadb.trash.findUnique({
      where: {
        id: id,
      },
    });
    if (!item) {
      return NextResponse.json(item);
    }
    if ((item && item.removedItemType === "Article") || "News" || "Theme") {
      if (typeof item.images === "string") {
        removeImageFromCloudinary(item.images);
      }
    }
    if (item && item.removedItemType) {
      //Remove from db
      const removedItem = await removeItemFromDb(id);
      return NextResponse.json(removedItem);
    }
  } catch (error) {
    console.log("REMOVE_FROM_TRASH", error);
  }
}

// RECOVERY TRASH ITEM
export async function POST(req: Request) {
  // This code creates a new theme and all relations based on data from the trash.
  const { userId } = auth();
  const body = await req.json();
  const { id } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const removedItem = await prismadb.trash.findUnique({
      where: {
        id: id,
      },
    });
    if (!removedItem) {
      return new NextResponse("Item for recovery not found", { status: 403 });
    }
    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }
    if (removedItem && removedItem?.removedItemType === "Article") {
      const res = await recoverArticle(removedItem, userId, id);

      if (!res.ok) {
        return new NextResponse(`${res.statusText}`, {
          status: 500,
        });
      }
      return NextResponse.json(res);
    }
    if (removedItem && removedItem?.removedItemType === "News") {
      const res = await recoverNews(removedItem, userId, id);
      if (!res.ok) {
        return new NextResponse(`${res.statusText}`, {
          status: 500,
        });
      }
      return NextResponse.json(res);
    }
    if (removedItem && removedItem.removedItemType === "Theme") {
      const res = await recoverTheme(removedItem, userId, id);
      if (!res.ok) {
        return new NextResponse(`${res.statusText}`, {
          status: 500,
        });
      }
      return NextResponse.json(res);
    }
    if (removedItem && removedItem.removedItemType === "Phrase") {
      const res = await recoverPhrase(removedItem, userId, id);
      if (!res.ok) {
        return new NextResponse(`${res.statusText}`, {
          status: 500,
        });
      }
      return NextResponse.json(res);
    }
  } catch (error) {
    console.log("RECOVERY_ERROR", error);
    return NextResponse.json(error);
  }
}
