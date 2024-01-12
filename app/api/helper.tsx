import prismadb from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
const cloudinary = require("cloudinary");
import { cloudinaryConfig } from "@/lib/cloudinary-config";

cloudinary.v2.config(cloudinaryConfig);

export const checkRole = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role;
  console.log(role);
  if (role !== "admin") {
    return false;
  }
  return true;
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
