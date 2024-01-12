import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../../helper";

export async function PATCH(
  req: Request,
  { params }: { params: { engTranslateId: string } }
) {
  const { userId } = auth();
  const body = await req.json();
  const { translate, transcription } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!translate) {
      return new NextResponse("Translate is required", { status: 403 });
    }
    if (!transcription) {
      return new NextResponse("Transcription is required", { status: 403 });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }
    const updatePhrase = await prismadb.engTranslate.update({
      where: {
        id: params.engTranslateId,
      },
      data: {
        translate,
        transcription,
      },
    });

    return NextResponse.json(updatePhrase);
  } catch (error) {
    console.log("[___ENG-RANSLATE_PATCH___]", error);
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

    const removedItem = await prismadb.engTranslate.delete({
      where: {
        id: itemID,
      },
    });
    return NextResponse.json(removedItem);
  } catch (error) {
    console.log("[MOVE_TO_THE_TRASH_ENGTRANSLATE]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
