import prismadb from "@/lib/prismadb";
import TagsTable from "@/components/tables/tagsTable/tags-table";
import { Article, TagList, Tag } from "@/lib/interfaces";

export default async function Page() {
  const tagsList = await prismadb.tag.findMany({
    include: { articles: true, images: true },
  });
  console.log(tagsList);
  return <TagsTable tagsList={tagsList} />;
}
