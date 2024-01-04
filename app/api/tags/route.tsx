import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { tag, rusTitle, images } = body;

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

    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin" && role !== "editor") {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const store = await prismadb.tag.create({
      data: {
        label: tag,
        rusTitle,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[TAG_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const tags = await prismadb.tag.findMany();

    return NextResponse.json(tags);
  } catch (error) {
    console.log("[TAG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
