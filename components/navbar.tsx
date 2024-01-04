import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import prismadb from "@/lib/prismadb";
// import AddArticleButton from "@/components/buttons/add-article-button";
// import AddTagButton from "@/components/buttons/add-tag-button";
// import CreateNewThemeButton from "./buttons/create-new-theme-button";
// import CreateNewPhrase from "@/components/buttons/create-new-phrase-button";
import DropdownMenu from "@/components/dropdown-menu";
import { ColorThemeToggle } from "./color-theme-toggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.articles.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <div className="mr-10">
            <DropdownMenu />
          </div>
          <ColorThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
