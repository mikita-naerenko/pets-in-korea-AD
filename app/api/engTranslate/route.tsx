import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { phraseId, theme, translate, transcription } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!phraseId) {
      return new NextResponse("Phrase ID is required", { status: 403 });
    }
    if (!theme) {
      return new NextResponse("Theme is required", { status: 403 });
    }
    if (!translate) {
      return new NextResponse("Translate is required", { status: 403 });
    }
    if (!transcription) {
      return new NextResponse("Transcription is required", { status: 403 });
    }

    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin" && role !== "editor") {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const newEngTranslate = await prismadb.engTranslate.create({
      data: {
        authorId: userId,
        translate,
        transcription,
        theme,
        koreanPhraseId: phraseId,
      },
    });
    return NextResponse.json(newEngTranslate);
  } catch (error) {
    console.log("[ENG-TRANSLATE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
