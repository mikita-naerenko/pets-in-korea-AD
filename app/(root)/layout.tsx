import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";
import SideBar from "@/components/side-bar";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const tags = await prismadb.tag.findMany();

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Navbar />
      {children}
    </>
  );
}
