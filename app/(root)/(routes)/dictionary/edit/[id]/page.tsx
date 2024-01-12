import prismadb from "@/lib/prismadb";
import EditThemeForm from "@/components/forms/edit-theme-form";

export default async function Page({ params }: { params: { id: string } }) {
  const themeId = params.id;
  const theme = await prismadb.theme.findUnique({
    where: {
      id: themeId,
    },
    include: {
      images: true,
      tags: true,
      phrases: {
        include: {
          rusTranslates: true,
          engTranslates: true,
        },
      },
    },
  });

  return (
    <>
      <div className=" w-7/12">
        {theme ? <EditThemeForm theme={theme} /> : <h2>Not found</h2>}
      </div>
    </>
  );
}
