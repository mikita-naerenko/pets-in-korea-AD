import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../../helper";

export async function GET(req: Request) {
  const itemID = req.url.split("/").pop();
  if (!itemID) {
    return new NextResponse("Phrases id is required", { status: 400 });
  }
  const phrase = await prismadb.koreanPhrase.findFirst({
    where: {
      id: itemID,
    },
  });
  return NextResponse.json(phrase);
}

export async function PATCH(
  req: Request,
  { params }: { params: { phraseId: string } }
) {
  const { userId } = auth();

  const body = await req.json();
  const { phrase } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!phrase) {
      return new NextResponse("Phrase is required", {
        status: 403,
      });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }
    const updatePhrase = await prismadb.koreanPhrase.update({
      where: {
        id: params.phraseId,
      },
      data: {
        phrase,
      },
    });

    return NextResponse.json(updatePhrase);
  } catch (error) {
    console.log("[PHRASE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
    const removingItem = await prismadb.koreanPhrase.findFirst({
      where: {
        id: itemID,
      },
      include: {
        rusTranslates: true,
        engTranslates: true,
      },
    });

    await prismadb.trash.create({
      data: {
        removedItemType: "Phrase",
        title: removingItem?.phrase || "",
        createdAt: removingItem?.createdAt,
        updatedAt: removingItem?.updatedAt,
        rusTranslates: JSON.stringify(removingItem?.rusTranslates[0]),
        engTranslates: JSON.stringify(removingItem?.engTranslates[0] || "[]"),
        themeId: removingItem?.themeId,
      },
    });
    const removedPhrase = await prismadb.koreanPhrase.delete({
      where: {
        id: itemID,
      },
    });
    return NextResponse.json(removedPhrase);
  } catch (error) {
    console.log("[MOVE_TO_THE_TRASH_PHRASE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
