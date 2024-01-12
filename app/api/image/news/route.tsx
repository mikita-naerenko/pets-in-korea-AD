import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs";

export async function PATCH(
  req: Request
  // { params }: { params: { articleId: string } }
) {
  const { userId } = auth();
  const body = await req.json();

  const { id } = body;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  if (!id) {
    return new NextResponse("id is required", { status: 403 });
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin" && role !== "editor") {
    return new NextResponse("Not enough privileges to perform this action.", {
      status: 403,
    });
  }

  try {
    const removingImage = await prismadb.newsImage.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(removingImage);
  } catch (error) {
    console.log("[REMOVE_THEME_IMAGE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
