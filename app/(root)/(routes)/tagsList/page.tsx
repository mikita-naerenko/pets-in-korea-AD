import prismadb from "@/lib/prismadb";
import TagsTable from "@/components/tables/tagsTable/tags-table";
import { Article, TagList } from "@/lib/interfaces";

export default async function Page() {
  const tagsList: TagList[] = await prismadb.tag.findMany({
    include: { articles: true },
  });

  return <TagsTable tagsList={tagsList} />;
}
