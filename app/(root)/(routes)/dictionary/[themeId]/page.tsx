import prismadb from "@/lib/prismadb";
import SingleThemeTable from "@/components/tables/single-theme-table/single-theme-table";

export default async function Page({
  params,
}: {
  params: { themeId: string };
}) {
  const themeId = params.themeId;
  const theme = await prismadb.theme.findUnique({
    where: {
      id: themeId,
    },
    include: {
      phrases: {
        include: {
          rusTranslates: true,
          engTranslates: true,
        },
      },
    },
  });

  return (
    <div>
      {theme ? <SingleThemeTable theme={theme} /> : <p>Theme not found</p>}
    </div>
  );
}
