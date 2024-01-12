import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import { cloudinaryConfig } from "@/lib/cloudinary-config";
const cloudinary = require("cloudinary");

cloudinary.v2.config(cloudinaryConfig);

import prismadb from "@/lib/prismadb";
import { checkRole } from "../../helper";

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
    const removingItem = await prismadb.theme.findFirst({
      where: {
        id: itemID,
      },
      include: {
        images: true,
        tags: true,
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
        label: removingItem?.label || "",
        rusLabel: removingItem?.rusLabel || "",
        description: removingItem?.description,
        createdAt: removingItem?.createdAt,
        updatedAt: removingItem?.updatedAt,
        tags: JSON.stringify(removingItem?.tags),
        images: JSON.stringify(removingItem?.images),
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

export async function PATCH(
  req: Request,
  { params }: { params: { themeId: string } }
) {
  const { userId } = auth();
  const body = await req.json();

  const { label, rusLabel, description, tagsList, images } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!label) {
      return new NextResponse("Label is required", {
        status: 403,
      });
    }
    if (!rusLabel) {
      return new NextResponse("rusLabel is required", {
        status: 403,
      });
    }
    if (!description) {
      return new NextResponse("description is required", {
        status: 403,
      });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const imageToRemove = await prismadb.theme.findUnique({
      where: {
        id: params.themeId,
      },
      include: { images: true },
    });
    const theme = await prismadb.theme.update({
      where: {
        id: params.themeId,
      },
      data: {
        label: label,
        rusLabel: rusLabel,
        description: description,
        tags: {
          connect: tagsList.map((tag: string) => ({ id: tag })),
        },
        images: {
          deleteMany: {},
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(theme);
  } catch (error) {
    console.log("[ARTICLES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
