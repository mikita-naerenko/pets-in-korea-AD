import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkRole } from "../helper";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, rusLabel, description, tagsList, images } = body;

    console.log(label, rusLabel, description, tagsList, images);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!label) {
      return new NextResponse("Label is required", {
        status: 403,
      });
    }
    if (!rusLabel) {
      return new NextResponse("rusLabel is required", {
        status: 403,
      });
    }
    if (!description) {
      return new NextResponse("description is required", {
        status: 403,
      });
    }

    const hasAdminPrivileges = await checkRole(userId);
    if (!hasAdminPrivileges) {
      return new NextResponse("Not enough privileges to perform this action.", {
        status: 403,
      });
    }

    const theme = await prismadb.theme.create({
      data: {
        label: label,
        rusLabel: rusLabel,
        description: description,
        tags: {
          connect: tagsList.map((tag: string) => ({ id: tag })),
        },
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.log("[THEME_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const theme = await prismadb.theme.findMany();

    return NextResponse.json(theme);
  } catch (error) {
    console.log("[THEME_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
