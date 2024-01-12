import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { cloudinaryConfig } from "@/lib/cloudinary-config";
import { checkRole } from "../../helper";
const cloudinary = require("cloudinary");

cloudinary.v2.config(cloudinaryConfig);

import prismadb from "@/lib/prismadb";

export async function DELETE(req: Request) {
  const { userId } = auth();
  const itemID = req.url.split("/").pop();
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

export async function PATCH(
  req: Request,
  { params }: { params: { tag: string } }
) {
  const { userId } = auth();
  const body = await req.json();

  const { tag, rusTitle, images } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!tag) {
      return new NextResponse("Tag is required", {
        status: 403,
      });
    }
    if (!rusTitle) {
      return new NextResponse("RusTitle is required", {
        status: 403,
      });
    }
    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const updatedTag = await prismadb.tag.update({
      where: {
        id: params.tag,
      },
      data: {
        label: tag,
        rusTitle,
        images: {
          deleteMany: {},
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.log("[TAG_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
