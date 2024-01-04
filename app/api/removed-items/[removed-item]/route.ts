import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { cloudinaryConfig } from "@/lib/cloudinary-config";
const cloudinary = require("cloudinary");

cloudinary.v2.config(cloudinaryConfig);

const removeItemFromDb = async (id: string | undefined) => {
  if (!id) throw new Error("Id is undefined");
  return await prismadb.trash.delete({
    where: {
      id: id,
    },
  });
};

import prismadb from "@/lib/prismadb";

export async function DELETE(req: Request) {
  // Permanently remove from the trash
  const { userId } = auth();
  const id: string | undefined = req.url.split("/").pop(); //Get id from request

  if (!id) {
    return new NextResponse("Item's id not found!", { status: 403 });
  }
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin") {
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

  //In case Article
  if ((item && item.removedItemType === "Article") || "News") {
    if (typeof item.images === "string" && JSON.parse(item.images).length > 0) {
      const imgToRemoveArr: string[] = JSON.parse(item.images).map(
        ///
        (image: { url: string }) => image.url.split("/").pop()?.split(".")[0]
      );
      // Remove images from cloundinary by id
      JSON.parse(item.images).length > 0 &&
        (await cloudinary.v2.api
          .delete_resources(imgToRemoveArr)
          .then((res: Response) => console.log(res)));
    }
  }
  if (item && item.removedItemType) {
    //Remove from db
    const removedItem = await removeItemFromDb(id);
    return NextResponse.json(removedItem);
  }
}

// RECOVERY TRASH ITEM
export async function POST(req: Request) {
  // This code creates a new theme and all relations based on data from the trash.
  const { userId } = auth();
  const body = await req.json();
  const { id } = body;

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

  // Find recoverable file
  const removedItem = await prismadb.trash.findUnique({
    where: {
      id: id,
    },
  });

  //In case type of item === Article
  if (removedItem && removedItem?.removedItemType === "Article") {
    //Create new article
    try {
      await prismadb.articles.create({
        data: {
          userId: userId || "",
          title: removedItem.title,
          description: removedItem.description || "",
          content: removedItem.content || "",
          nameOfSource: removedItem?.nameOfSource,
          linkToSource: removedItem?.linkToSource,
          authorName: removedItem?.authorName,
          authorLink: removedItem?.authorLink,
          tags: {
            connect:
              typeof removedItem.tags === "string"
                ? JSON.parse(removedItem.tags).map((tag: string) => tag)
                : [],
          },
          images: {
            createMany: {
              data:
                JSON.parse(
                  typeof removedItem.images === "string"
                    ? removedItem.images
                    : "[]"
                ).map((image: { url: string }) => ({
                  url: image.url,
                })) || [],
            },
          },
        },
      });
      // Remove item from the trash
      await removeItemFromDb(id);
    } catch (error) {
      console.log("___RECOVER-ARTICLE____", error);
    }
  }

  if (removedItem && removedItem?.removedItemType === "News") {
    //Create new news
    try {
      await prismadb.news.create({
        data: {
          userId: userId || "",
          title: removedItem.title,
          description: removedItem.description || "",
          content: removedItem.content || "",
          nameOfSource: removedItem?.nameOfSource,
          linkToSource: removedItem?.linkToSource,
          authorName: removedItem?.authorName,
          authorLink: removedItem?.authorLink,
          images: {
            createMany: {
              data:
                JSON.parse(
                  typeof removedItem.images === "string"
                    ? removedItem.images
                    : "[]"
                ).map((image: { url: string }) => ({
                  url: image.url,
                })) || [],
            },
          },
        },
      });
      // Remove item from the trash
      await removeItemFromDb(id);
    } catch (error) {
      console.log("___RECOVER-ARTICLE____", error);
    }
  }

  //In case type of item === Theme
  if (removedItem && removedItem.removedItemType === "Theme") {
    const phrasesData =
      typeof removedItem.phrases === "string"
        ? JSON.parse(removedItem.phrases || "[]")
        : [];
    //Creqte new theme
    const recoveryTheme = await prismadb.theme.create({
      data: {
        label: removedItem.title,
      },
    });
    const themeId = recoveryTheme.id;
    // Inside cycle create new relations for theme
    phrasesData.forEach(
      async (phrase: {
        id: string;
        authorId: string;
        phrase: string;
        rusTranslates: {
          authorId: string;
          translate: string;
          transcription: string;
        }[];
        engTranslates: {
          authorId: string;
          translate: string;
          transcription: string;
        }[];
      }) => {
        // Create phrase
        const newPhrase = await prismadb.koreanPhrase.create({
          data: {
            authorId: phrase.authorId,
            phrase: phrase.phrase,
            themeId: themeId,
          },
        });
        if (phrase.rusTranslates.length > 0) {
          // Create translate for Rus
          await prismadb.rusTranslate.create({
            data: {
              authorId: phrase.rusTranslates[0].authorId,
              translate: phrase.rusTranslates[0].translate,
              transcription: phrase.rusTranslates[0].transcription,
              theme: recoveryTheme.label,
              koreanPhraseId: newPhrase.id,
            },
          });
        }
        if (phrase.engTranslates.length > 0) {
          // Create translate for Eng
          await prismadb.engTranslate.create({
            data: {
              authorId: phrase.engTranslates[0].authorId,
              translate: phrase.engTranslates[0].translate,
              transcription: phrase.engTranslates[0].transcription,
              theme: recoveryTheme.label,
              koreanPhraseId: newPhrase.id,
            },
          });
        }
      }
    );
    //Remove item from the trash
    await removeItemFromDb(id);
  }
  //In case type of item === Theme
  if (removedItem && removedItem.removedItemType === "Phrase") {
    if (!removedItem.themeId) return;
    if (!userId) return;
    const rusTranslateData: {
      translate: string;
      transcription: string;
      koreanPhraseId: string;
      theme: string;
    } =
      typeof removedItem.rusTranslates === "string"
        ? JSON.parse(removedItem.rusTranslates || "{}")
        : [];
    const engTranslateData: {
      translate: string;
      transcription: string;
      koreanPhraseId: string;
      theme: string;
    } =
      typeof removedItem.engTranslates === "string"
        ? JSON.parse(removedItem.engTranslates || "{}")
        : [];
    // console.log(rusTranslateData.translate);

    const recovereblePhrase = await prismadb.koreanPhrase.create({
      data: {
        themeId: removedItem.themeId,
        phrase: removedItem.title,
        authorId: userId,
      },
    });
    const phraseId = recovereblePhrase.id;
    if (rusTranslateData.translate) {
      await prismadb.rusTranslate.create({
        data: {
          authorId: userId,
          translate: rusTranslateData.translate,
          transcription: rusTranslateData.transcription,
          koreanPhraseId: phraseId,
          theme: rusTranslateData.theme,
        },
      });
    }
    if (engTranslateData.translate) {
      await prismadb.engTranslate.create({
        data: {
          authorId: userId,
          translate: engTranslateData.translate,
          transcription: engTranslateData.transcription,
          koreanPhraseId: phraseId,
          theme: engTranslateData.theme,
        },
      });
    }
    await removeItemFromDb(id);
  }
  //In case type of item === EngTranslate
  if (removedItem && removedItem?.removedItemType === "EngTranslate") {
    //Create new EngTranslate

    const engTranslate =
      typeof removedItem.engTranslates === "string"
        ? JSON.parse(removedItem.engTranslates || "[]")
        : [];

    // Check on existing translate
    const checkOnReplace = await prismadb.koreanPhrase.findUnique({
      where: {
        id: engTranslate.koreanPhraseId,
      },
      include: {
        engTranslates: true,
      },
    });
    if (checkOnReplace && checkOnReplace.engTranslates.length !== 0) {
      return new NextResponse(
        "Eng translate already exist. Please remove old translate from the trash",
        { status: 400 }
      );
    }

    try {
      await prismadb.engTranslate.create({
        data: {
          authorId: engTranslate.authorId,
          translate: engTranslate.translate,
          transcription: engTranslate.transcription,
          theme: engTranslate.theme,
          koreanPhraseId: engTranslate.koreanPhraseId,
        },
      });
      // Remove item from the trash
      await removeItemFromDb(id);
    } catch (error) {
      console.log("___RECOVER-ARTICLE____", error);
    }
  }

  return NextResponse.json(removedItem);
}
