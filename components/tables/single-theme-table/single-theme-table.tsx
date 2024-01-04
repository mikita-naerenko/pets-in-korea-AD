"use client";
import CreateNewCurrentPhrase from "@/components/buttons/create-new-current-phrase";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Theme } from "@/lib/interfaces";
import SingleThemeTableBody from "./table-body";

export default function SingleThemeTable({ theme }: { theme: Theme }) {
  return (
    <div className="relative">
      <div className="absolute top-0 right-10">
        <CreateNewCurrentPhrase />
      </div>

      <h2 className="text-center my-3 font-bold text-3xl">{theme.label}</h2>
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Phrase</TableHead>
            <TableHead>Rus </TableHead>
            <TableHead>Eng</TableHead>
            <TableHead>Dev Tools</TableHead>
          </TableRow>
        </TableHeader>
        <SingleThemeTableBody theme={theme} />
      </Table>
    </div>
  );
}
