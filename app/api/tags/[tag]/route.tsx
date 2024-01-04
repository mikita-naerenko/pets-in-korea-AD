import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { cloudinaryConfig } from "@/lib/cloudinary-config";
const cloudinary = require("cloudinary");

cloudinary.v2.config(cloudinaryConfig);

import prismadb from "@/lib/prismadb";

export async function DELETE(req: Request) {
  const itemID = req.url.split("/").pop();
  try {
    if (itemID) {
      const tag = await prismadb.tag.findUnique({
        where: { id: itemID },
        include: { images: true },
      });
      if (tag && tag.images.length > 0) {
        const imgToRemoveArr: string[] = tag.images.map(
          ///
          (image: { url: string }) => {
            const fileName = image.url.split("/").pop();
            return fileName ? fileName.split(".")[0] : "";
          }
        );
        await cloudinary.v2.api
          .delete_resources(imgToRemoveArr)
          .then((res: Response) => console.log(res));
      }

      const removingItem = await prismadb.tag.delete({
        where: { id: itemID },
      });
      return NextResponse.json(removingItem);
    }
  } catch (error) {
    console.log("[TAG_REMOVE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
