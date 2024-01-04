"use client";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import DictionaryTableBody from "./table-body";
import { Theme } from "@/lib/interfaces";

export default function ThemesTable({ themes }: { themes: Theme[] }) {
  return (
    <div>
      <p className="text-center my-3 font-bold text-3xl">Dictionary table</p>
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Theme</TableHead>
            <TableHead>Number of phrases</TableHead>
            <TableHead>CreateAt</TableHead>
            <TableHead>UpdateAt</TableHead>
            <TableHead>Tools Bar</TableHead>
          </TableRow>
        </TableHeader>
        <DictionaryTableBody themes={themes} />
      </Table>
    </div>
  );
}
