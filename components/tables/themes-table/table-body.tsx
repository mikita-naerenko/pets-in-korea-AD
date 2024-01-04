"use client";

import MoveToTrashButton from "@/components/buttons/move-to-trash-button";
import ViewThemeButton from "@/components/buttons/view-theme-button";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Theme } from "@/lib/interfaces";
import { useRouter } from "next/navigation";

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
