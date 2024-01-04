"use client";
import AddArticleButton from "@/components/buttons/add-article-button";
import AddTagButton from "@/components/buttons/add-tag-button";
import CreateNewThemeButton from "@/components/buttons/create-new-theme-button";
import CreateNewPhrase from "@/components/buttons/create-new-phrase-button";
import CreateNewsButton from "./buttons/create-news-button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function DropdownMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <AddArticleButton />
            <AddTagButton />
            <CreateNewThemeButton />
            <CreateNewPhrase />
            <CreateNewsButton />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
