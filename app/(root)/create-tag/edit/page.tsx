import EditTagForm from "@/components/forms/edit-tag";
import prismadb from "@/lib/prismadb";

interface Params {
  params: {
    edit: string;
  };
  searchParams: Record<string, never>;
}

export default async function Page(params: Params) {
  const tag = await prismadb.tag.findUnique({
    where: {
      id: params.params.edit,
    },
    include: { images: true },
  });
  return <div>{tag ? <EditTagForm tag={tag} /> : null}</div>;
}
