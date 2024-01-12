"use client";

import MoveToTrashButton from "@/components/buttons/move-to-trash-button";
import ViewThemeButton from "@/components/buttons/view-theme-button";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Theme } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DictionaryTableBody({ themes }: { themes: Theme[] }) {
  const router = useRouter();
  return (
    <TableBody>
      {themes.map((theme) => (
        <TableRow
          key={theme.id}
          onClick={() => router.push(`/dictionary/${theme.id}`)}
        >
          <TableCell className="font-medium">{theme.label}</TableCell>
          <TableCell className="font-medium">{theme.rusLabel}</TableCell>
          <TableCell className="font-medium">{theme.description}</TableCell>
          <TableCell className="font-medium">
            {theme.tags.length > 0
              ? theme.tags.map((tag) => <b key={tag.id}>#{tag.label} </b>)
              : "none"}
          </TableCell>
          <TableCell>
            {theme.images[0]?.url ? (
              <Image
                src={theme.images[0].url}
                width={50}
                height={40}
                alt="smthng"
              />
            ) : (
              "none"
            )}
          </TableCell>
          <TableCell className="font-medium">{theme.phrases.length}</TableCell>
          <TableCell className="font-medium">
            {new Date(theme.createdAt).toLocaleString("ru-RU")}
          </TableCell>
          <TableCell className="font-medium">
            {new Date(theme.updatedAt).toLocaleString("ru-RU")}
          </TableCell>
          <TableCell className="font-medium">
            <ViewThemeButton theme={theme} />
            <MoveToTrashButton
              itemId={theme.id}
              itemName={theme.label}
              typeOfItem="theme"
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
