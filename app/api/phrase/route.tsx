import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      phrase,
      selectedTheme,
      toRusTranslate,
      toRusTranscription,
      toEngTranslate,
      toEngTranscription,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!phrase) {
      return new NextResponse("Phrase is required", { status: 400 });
    }
    if (!selectedTheme) {
      return new NextResponse("Theme is required", { status: 400 });
    }

    if (!toRusTranslate) {
      return new NextResponse("Russian translate is required", { status: 400 });
    }
    if (!toRusTranscription) {
      return new NextResponse("Russian transcription is required", {
        status: 400,
      });
    }
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin" && role !== "editor") {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const newPhrase = await prismadb.koreanPhrase.create({
      data: {
        authorId: userId,
        phrase,
        themeId: selectedTheme,
      },
    });

    const koreanPhraseId = newPhrase.id;

    if (toRusTranslate && toRusTranscription) {
      const newRusTranslate = await prismadb.rusTranslate.create({
        data: {
          authorId: userId,
          translate: toRusTranslate,
          transcription: toRusTranscription,
          theme: selectedTheme,
          koreanPhraseId,
        },
      });
    }
    if (toEngTranslate && toEngTranscription) {
      const newEngTranslate = await prismadb.engTranslate.create({
        data: {
          authorId: userId,
          translate: toEngTranslate,
          transcription: toEngTranscription,
          theme: selectedTheme,
          koreanPhraseId,
        },
      });
    }
    return NextResponse.json(newPhrase);
  } catch (error) {
    console.log("PHRASE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
