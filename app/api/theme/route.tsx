import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { theme } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!theme) {
      return new NextResponse("Theme is required", {
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

    const store = await prismadb.theme.create({
      data: {
        label: theme,
      },
    });

    return NextResponse.json(store);
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
