import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../../helper";

export async function PATCH(
  req: Request,
  { params }: { params: { rusTranslateId: string } }
) {
  const { userId } = auth();
  const body = await req.json();
  const { translate, transcription } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!translate) {
      return new NextResponse("Translate is required", {
        status: 403,
      });
    }
    if (!transcription) {
      return new NextResponse("Transcription is required", {
        status: 403,
      });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const updatePhrase = await prismadb.rusTranslate.update({
      where: {
        id: params.rusTranslateId,
      },
      data: {
        translate,
        transcription,
      },
    });

    return NextResponse.json(updatePhrase);
  } catch (error) {
    console.log("[___RUS-TRANSLATE_PATCH___]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
