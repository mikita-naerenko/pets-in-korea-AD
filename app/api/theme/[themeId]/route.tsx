import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

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

  try {
    const removingItem = await prismadb.theme.findFirst({
      where: {
        id: itemID,
      },
      include: {
        phrases: {
          include: {
            rusTranslates: true,
            engTranslates: true,
          },
        },
      },
    });

    const movedToTrash = await prismadb.trash.create({
      data: {
        removedItemType: "Theme",
        title: removingItem?.label || "",
        createdAt: removingItem?.createdAt,
        updatedAt: removingItem?.updatedAt,
        phrases: JSON.stringify(removingItem?.phrases),
      },
    });

    const removedItem = await prismadb.theme.delete({
      where: {
        id: itemID,
      },
    });
    return NextResponse.json(removedItem);
  } catch (error) {
    console.log("[THEME_MOVE_TO_THE_TRASH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
