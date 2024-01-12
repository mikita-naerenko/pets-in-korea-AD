import prismadb from "@/lib/prismadb";
import { Phrase, RemovedItem } from "../../../../lib/interfaces";
import { NextResponse } from "next/server";
const cloudinary = require("cloudinary");
import { cloudinaryConfig } from "@/lib/cloudinary-config";

cloudinary.v2.config(cloudinaryConfig);

export const removeItemFromDb = async (id: string | undefined) => {
  if (!id) throw new Error("Id is undefined");
  return await prismadb.trash.delete({
    where: {
      id: id,
    },
  });
};

export const removeImageFromCloudinary = async (images: string) => {
  const imgToRemoveArr: string[] = JSON.parse(images).map(
    ///
    (image: { url: string }) => image.url.split("/").pop()?.split(".")[0]
  );
  await cloudinary.v2.api
    .delete_resources(imgToRemoveArr)
    .then((res: Response) => console.log(res));
};

export const recoverArticle = async (
  removedItem: RemovedItem,
  userId: string,
  id: string
) => {
  try {
    const res = await prismadb.articles.create({
      data: {
        userId: userId || "",
        title: removedItem.title || "",
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
    removeItemFromDb(id);
    return NextResponse.json(res);
  } catch (error) {
    console.log("RECOVER_ARTICLE_ERROR", error);
    return new NextResponse("Error during recovery article", {
      status: 500,
      statusText: "Error during recovery article",
    });
  }
};

export const recoverNews = async (
  removedItem: RemovedItem,
  userId: string,
  id: string
) => {
  try {
    const res = await prismadb.news.create({
      data: {
        userId: userId || "",
        title: removedItem.title || "",
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
    removeItemFromDb(id);
    return NextResponse.json(res);
  } catch (error) {
    console.log("RECOVER_NEWS_ERROR", error);
    return new NextResponse("Error during recovery news", {
      status: 500,
      statusText: "Error during recovery news",
    });
  }
};

export const recoverTheme = async (
  removedItem: RemovedItem,
  userId: string,
  id: string
) => {
  const phrasesData =
    typeof removedItem.phrases === "string"
      ? JSON.parse(removedItem.phrases || "[]")
      : [];
  try {
    const res = await prismadb.theme.create({
      data: {
        label: removedItem.label || "",
        rusLabel: removedItem.rusLabel || "",
        description: removedItem.description || "",
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
        tags: {
          connect:
            typeof removedItem.tags === "string"
              ? JSON.parse(removedItem.tags).map((tag: string) => tag)
              : [],
        },
      },
    });
    const themeId = res.id;
    phrasesData.forEach(async (phrase: Phrase, id: string) => {
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
            theme: res.label,
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
            theme: res.label,
            koreanPhraseId: newPhrase.id,
          },
        });
      }
    });
    removeItemFromDb(id);
    return NextResponse.json(res);
  } catch (error) {
    console.log("RECOVER_THEME_ERROR", error);
    return new NextResponse("Error during recovery theme", {
      status: 500,
      statusText: "Error during recovery theme",
    });
  }
};

export const recoverPhrase = async (
  removedItem: RemovedItem,
  userId: string,
  id: string
) => {
  try {
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

    const recovereblePhrase = await prismadb.koreanPhrase.create({
      data: {
        themeId: removedItem.themeId || "",
        phrase: removedItem.title || "",
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
    removeItemFromDb(id);
    return NextResponse.json(recovereblePhrase);
  } catch (error) {
    console.log("RECOVER_PHRASE_ERROR", error);
    return new NextResponse("Error during recovery phrase", {
      status: 500,
      statusText: "Error during recovery phrase",
    });
  }
};
